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
  Easing,
} from 'remotion';

export type ReelProps = {
  texto: string;
  hashtags: string;
  imagen: string;
  musicFile: string;
  variant: number;
};

const BRAND = { dark: '#0A1F16', green: '#1D9E75', light: '#5DCAA5', pale: '#E1F5EE' };
const FONT = 'Arial, Helvetica, sans-serif';

const LogoMark: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M6 22 L14 6 L22 22" stroke={BRAND.light} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 16 L19 16" stroke={BRAND.light} strokeWidth="2" strokeLinecap="round" />
    <circle cx="14" cy="6" r="2" fill={BRAND.green} />
  </svg>
);

export const Reel: React.FC<ReelProps> = ({ texto, imagen, musicFile, variant }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const v = ((Math.floor(variant) % 4) + 4) % 4;

  // Fondo con movimiento claro: zoom + paneo
  const zoom = interpolate(frame, [0, durationInFrames], [1.12, 1.32]);
  const panX = interpolate(frame, [0, durationInFrames], [-30, 30]);

  // Entradas
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const textSpring = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const textY = interpolate(textSpring, [0, 1], [80, 0]);
  const textOp = textSpring;
  const barW = interpolate(spring({ frame: frame - 26, fps, config: { damping: 200 } }), [0, 1], [0, 300]);

  // End card (CTA) entra en los ultimos ~4.5s
  const ctaStart = durationInFrames - 135;
  const ctaIn = spring({ frame: frame - ctaStart, fps, config: { damping: 200 } });
  const ctaY = interpolate(ctaIn, [0, 1], [360, 0]);
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const accent = [BRAND.green, BRAND.light, BRAND.pale, BRAND.green][v];
  // posicion del texto principal segun variante
  const justify = ['center', 'flex-end', 'flex-end', 'flex-start'][v] as React.CSSProperties['justifyContent'];
  const align = ['center', 'flex-start', 'flex-start', 'flex-start'][v] as React.CSSProperties['alignItems'];
  const padBottom = [0, 430, 430, 0][v];
  const padTop = [0, 0, 0, 360][v];
  const fontSize = [104, 92, 108, 96][v];
  const textAlign = (v === 0 ? 'center' : 'left') as React.CSSProperties['textAlign'];

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.dark, opacity: fadeOut }}>
      {/* Fondo */}
      <AbsoluteFill>
        <Img
          src={imagen}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom}) translateX(${panX}px)` }}
        />
      </AbsoluteFill>

      {/* Scrim para legibilidad (siempre) */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(8,20,15,0.92) 0%, rgba(8,20,15,0.35) 45%, rgba(8,20,15,0.55) 100%)',
        }}
      />

      {/* Chip de marca arriba (SIEMPRE visible) */}
      <AbsoluteFill style={{ padding: 60, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: BRAND.dark,
            border: `2px solid ${BRAND.green}`,
            borderRadius: 999,
            padding: '14px 26px 14px 18px',
            opacity: logoIn,
            transform: `translateY(${interpolate(logoIn, [0, 1], [-30, 0])}px)`,
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}
        >
          <LogoMark size={40} />
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: BRAND.pale, letterSpacing: -1 }}>varka</span>
        </div>
      </AbsoluteFill>

      {/* Texto principal */}
      <AbsoluteFill style={{ display: 'flex', justifyContent: justify, alignItems: align, padding: 80, paddingBottom: padBottom, paddingTop: padTop, textAlign }}>
        <div style={{ transform: `translateY(${textY}px)`, opacity: textOp, maxWidth: 940 }}>
          <div style={{ height: 12, width: barW, background: accent, borderRadius: 6, marginBottom: 30, marginLeft: v === 0 ? 'auto' : 0, marginRight: v === 0 ? 'auto' : 0 }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize, color: '#fff', lineHeight: 1.05, textShadow: '0 4px 28px rgba(0,0,0,0.6)' }}>
            {texto}
          </div>
        </div>
      </AbsoluteFill>

      {/* END CARD: CTA + contacto (entra al final) */}
      <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
        <div
          style={{
            transform: `translateY(${ctaY}px)`,
            opacity: ctaIn,
            background: BRAND.dark,
            borderTop: `4px solid ${BRAND.green}`,
            padding: '46px 60px 70px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 36, color: BRAND.light, fontWeight: 700, marginBottom: 10 }}>
            Automatizá tu negocio con IA
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 76, color: BRAND.pale, letterSpacing: -1 }}>varka.tech</div>
          <div style={{ fontFamily: FONT, fontSize: 30, color: 'rgba(255,255,255,0.85)', marginTop: 14 }}>
            Diagnóstico gratis · escribinos por DM
          </div>
        </div>
      </AbsoluteFill>

      {musicFile ? <Audio src={staticFile(`music/${musicFile}`)} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};