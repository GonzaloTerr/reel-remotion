import React from 'react';
import {
  AbsoluteFill,
  Img,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export type ReelProps = {
  texto: string; // "frase de dolor | frase de solucion"
  hashtags: string;
  imagen: string;
  musicFile: string;
  variant: number;
};

const BRAND = { dark: '#08160F', green: '#1D9E75', light: '#5DCAA5', pale: '#E1F5EE' };
const FONT = 'Arial, Helvetica, sans-serif';

const LogoChip: React.FC<{ op: number; y: number }> = ({ op, y }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(8,22,15,0.85)',
      border: `2px solid ${BRAND.green}`,
      borderRadius: 999,
      padding: '14px 28px 14px 18px',
      opacity: op,
      transform: `translateY(${y}px)`,
    }}
  >
    <svg width={38} height={38} viewBox="0 0 28 28" fill="none">
      <path d="M6 22 L14 6 L22 22" stroke={BRAND.light} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16 L19 16" stroke={BRAND.light} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="6" r="2" fill={BRAND.green} />
    </svg>
    <span style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: BRAND.pale, letterSpacing: -1 }}>varka</span>
  </div>
);

const Glow: React.FC<{ x: number; y: number; size: number; color: string }> = ({ x, y, size, color }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, rgba(8,22,15,0) 70%)`,
    }}
  />
);

// Frase con texto que entra palabra por palabra
const Frase: React.FC<{ texto: string; startFrame: number; op: number; color: string; accent?: string }> = ({
  texto,
  startFrame,
  op,
  color,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabras = (texto || '').split(' ').filter(Boolean);
  const len = (texto || '').length;
  const fs = len > 70 ? 66 : len > 52 ? 78 : len > 38 ? 92 : len > 24 ? 104 : 118;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 90, opacity: op }}>
      <div style={{ maxWidth: 960, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px' }}>
          {palabras.map((w, i) => {
            const wIn = spring({ frame: frame - (startFrame + i * 5), fps, config: { damping: 200 } });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontWeight: 900,
                  fontSize: fs,
                  color,
                  lineHeight: 1.06,
                  letterSpacing: -2,
                  textShadow: '0 6px 30px rgba(0,0,0,0.6)',
                  transform: `translateY(${interpolate(wIn, [0, 1], [60, 0])}px)`,
                  opacity: wIn,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {accent ? (
          <div
            style={{
              height: 14,
              width: interpolate(spring({ frame: frame - (startFrame + 20), fps, config: { damping: 200 } }), [0, 1], [0, 320]),
              background: accent,
              borderRadius: 7,
              margin: '42px auto 0',
            }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = ({ texto, imagen, musicFile, variant }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const v = ((Math.floor(variant) % 4) + 4) % 4;
  const accent = [BRAND.green, BRAND.light, BRAND.pale, '#7BE0BC'][v];
  const t = frame / fps;

  // Partes: dolor | solucion
  const partes = (texto || '').split('|').map((s) => s.trim()).filter(Boolean);
  const dolor = partes[0] || '';
  const solucion = partes[1] || '';
  const dos = !!solucion;

  // Fondo
  const zoom = interpolate(frame, [0, durationInFrames], [1.2, 1.6]);
  const panX = interpolate(frame, [0, durationInFrames], [-70, 70]);
  const g1x = 540 + Math.sin(t * 0.6) * 380;
  const g1y = 760 + Math.cos(t * 0.5) * 460;
  const g2x = 540 + Math.cos(t * 0.45) * 420;
  const g2y = 1240 + Math.sin(t * 0.4) * 420;
  const g3x = 540 + Math.sin(t * 0.35 + 2) * 300;
  const g3y = 980 + Math.cos(t * 0.3 + 1) * 520;

  const logoIn = spring({ frame, fps, config: { damping: 200 } });

  // Tiempos de las frases. Con dos frases: dolor 0-160, solucion 168-300.
  const dolorOp = dos
    ? interpolate(frame, [140, 160], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame, [286, 306], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const solOp = interpolate(frame, [286, 306], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Escena CTA (B) 300-450
  const bOp = interpolate(frame, [300, 324], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bScale = interpolate(spring({ frame: frame - 300, fps, config: { damping: 200 } }), [0, 1], [0.82, 1]);
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.dark, opacity: fadeOut, fontFamily: FONT }}>
      {/* Textura */}
      <AbsoluteFill>
        <Img
          src={imagen}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(3px) brightness(0.62) saturate(1.1)',
            transform: `scale(${zoom}) translateX(${panX}px)`,
          }}
        />
      </AbsoluteFill>
      {/* Glows en movimiento */}
      <AbsoluteFill>
        <Glow x={g1x} y={g1y} size={820} color={`${BRAND.green}45`} />
        <Glow x={g2x} y={g2y} size={680} color={`${BRAND.light}33`} />
        <Glow x={g3x} y={g3y} size={560} color={`${BRAND.green}33`} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(8,22,15,0.34) 0%, rgba(8,22,15,0.66) 100%)' }} />

      {/* Logo */}
      <AbsoluteFill style={{ padding: 60, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <LogoChip op={logoIn} y={interpolate(logoIn, [0, 1], [-30, 0])} />
      </AbsoluteFill>

      {/* FRASE 1: dolor (blanco) */}
      <Frase texto={dolor} startFrame={12} op={dolorOp} color="#fff" />

      {/* FRASE 2: solucion de Varka (verde de marca) */}
      {dos ? <Frase texto={solucion} startFrame={170} op={solOp} color={BRAND.light} accent={accent} /> : null}

      {/* ESCENA B: CTA + contacto */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 90, opacity: bOp }}>
        <div style={{ textAlign: 'center', transform: `scale(${bScale})` }}>
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <LogoChip op={1} y={0} />
          </div>
          <div style={{ fontSize: 44, color: BRAND.light, fontWeight: 700, marginBottom: 16 }}>Automatizá tu negocio con IA</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 108, color: '#fff', letterSpacing: -2 }}>varka.tech</div>
          <div style={{ fontSize: 38, color: BRAND.pale, marginTop: 24 }}>Diagnóstico gratis · escribinos por DM</div>
        </div>
      </AbsoluteFill>

      {musicFile ? <Audio src={staticFile(`music/${musicFile}`)} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};