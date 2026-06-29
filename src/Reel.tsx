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
  texto: string;
  hashtags: string;
  imagen: string;
  musicFile: string;
  variant: number;
};

const BRAND = {
  dark: '#0A1F16',
  green: '#1D9E75',
  light: '#5DCAA5',
  pale: '#E1F5EE',
};

const FONT = 'Arial, Helvetica, sans-serif';

// Logo simple de Varka (mismo trazo que usan los emails)
const Logo: React.FC<{ color?: string }> = ({ color = BRAND.pale }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <svg width="46" height="46" viewBox="0 0 28 28" fill="none">
      <path d="M6 22 L14 6 L22 22" stroke={BRAND.light} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16 L19 16" stroke={BRAND.light} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="6" r="2" fill={BRAND.green} />
    </svg>
    <span style={{ fontFamily: 'Georgia, serif', fontSize: 44, color, letterSpacing: -1 }}>varka</span>
  </div>
);

export const Reel: React.FC<ReelProps> = ({ texto, hashtags, imagen, musicFile, variant }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fondo: zoom lento (Ken Burns)
  const zoom = interpolate(frame, [0, durationInFrames], [1.08, 1.24]);

  // Entrada del texto (resorte) y del logo
  const enter = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const textY = interpolate(enter, [0, 1], [70, 0]);
  const textOp = interpolate(enter, [0, 1], [0, 1]);

  // Barra de acento que crece
  const barW = interpolate(spring({ frame: frame - 18, fps, config: { damping: 200 } }), [0, 1], [0, 240]);

  // Fade out global al final
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0]);

  const v = ((Math.floor(variant) % 4) + 4) % 4;

  const bg = (
    <AbsoluteFill>
      <Img
        src={imagen}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }}
      />
    </AbsoluteFill>
  );

  // ---- Estilos por variante ----
  let overlay: React.ReactNode = null;
  let textBox: React.CSSProperties = {};
  let textStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.1,
    textShadow: '0 4px 24px rgba(0,0,0,0.45)',
  };
  let accentColor = BRAND.light;
  let logoColor = BRAND.pale;

  if (v === 0) {
    // Centro oscuro
    overlay = <AbsoluteFill style={{ background: 'rgba(8,20,15,0.55)' }} />;
    textBox = { justifyContent: 'center', alignItems: 'center', padding: 90, textAlign: 'center' };
    textStyle = { ...textStyle, fontSize: 96 };
  } else if (v === 1) {
    // Banda inferior verde marca
    overlay = (
      <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
        <div style={{ height: '44%', background: BRAND.dark }} />
      </AbsoluteFill>
    );
    textBox = { justifyContent: 'flex-end', alignItems: 'flex-start', padding: 80, paddingBottom: 220, textAlign: 'left' };
    textStyle = { ...textStyle, fontSize: 88, color: BRAND.pale, textShadow: 'none' };
    accentColor = BRAND.green;
  } else if (v === 2) {
    // Minimal abajo, degrade fuerte
    overlay = (
      <AbsoluteFill
        style={{ background: 'linear-gradient(to top, rgba(8,20,15,0.92) 18%, rgba(8,20,15,0) 60%)' }}
      />
    );
    textBox = { justifyContent: 'flex-end', alignItems: 'flex-start', padding: 80, paddingBottom: 240, textAlign: 'left' };
    textStyle = { ...textStyle, fontSize: 100 };
  } else {
    // Tinte verde, texto arriba
    overlay = <AbsoluteFill style={{ background: BRAND.green, mixBlendMode: 'multiply', opacity: 0.78 }} />;
    textBox = { justifyContent: 'flex-start', alignItems: 'flex-start', padding: 90, paddingTop: 240, textAlign: 'left' };
    textStyle = { ...textStyle, fontSize: 94, color: '#ffffff' };
    accentColor = BRAND.pale;
    logoColor = '#ffffff';
  }

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.dark, opacity: fadeOut }}>
      {bg}
      {overlay}

      {/* Logo arriba */}
      <AbsoluteFill style={{ padding: 70, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <div style={{ opacity: textOp }}>
          <Logo color={logoColor} />
        </div>
      </AbsoluteFill>

      {/* Texto principal */}
      <AbsoluteFill style={{ display: 'flex', ...textBox }}>
        <div style={{ transform: `translateY(${textY}px)`, opacity: textOp, maxWidth: 920 }}>
          <div style={{ height: 10, width: barW, background: accentColor, borderRadius: 6, marginBottom: 28 }} />
          <div style={textStyle}>{texto}</div>
        </div>
      </AbsoluteFill>

      {/* Hashtags abajo */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: 60 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 30,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            opacity: textOp,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {hashtags}
        </div>
      </AbsoluteFill>

      {/* Musica (rotativa, opcional) */}
      {musicFile ? <Audio src={staticFile(`music/${musicFile}`)} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};