import React from 'react';
import { AbsoluteFill, Img } from 'remotion';

// Slide estatico 1080x1350 (4:5) para carruseles de Instagram.
// kind: 'cover' (gancho sobre foto) | 'content' (numero + titulo + cuerpo) | 'cta'
export type SlideProps = {
  kind: 'cover' | 'content' | 'cta';
  titulo: string;
  cuerpo: string;
  imagen: string;
  index: number; // ordinal del slide de contenido (1-based); 0 en cover/cta
  total: number; // cantidad de slides de contenido
  variant: number;
};

const BRAND = { dark: '#08160F', green: '#1D9E75', light: '#5DCAA5', pale: '#E1F5EE' };
const FONT = 'Arial, Helvetica, sans-serif';

const Logo: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M6 22 L14 6 L22 22" stroke={BRAND.light} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16 L19 16" stroke={BRAND.light} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="6" r="2" fill={BRAND.green} />
    </svg>
    <span style={{ fontFamily: 'Georgia, serif', fontSize: size, color: BRAND.pale, letterSpacing: -1 }}>varka</span>
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

// Puntitos de progreso del carrusel
const Dots: React.FC<{ index: number; total: number }> = ({ index, total }) => (
  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === index - 1 ? 40 : 14,
          height: 14,
          borderRadius: 7,
          background: i === index - 1 ? BRAND.green : 'rgba(225,245,238,0.28)',
        }}
      />
    ))}
  </div>
);

const fitTitle = (t: string) => {
  const len = (t || '').length;
  return len > 90 ? 66 : len > 64 ? 80 : len > 44 ? 96 : len > 26 ? 116 : 132;
};
const fitBody = (t: string) => {
  const len = (t || '').length;
  return len > 180 ? 40 : len > 120 ? 48 : len > 70 ? 56 : 62;
};

export const Slide: React.FC<SlideProps> = ({ kind, titulo, cuerpo, imagen, index, total, variant }) => {
  const v = ((Math.floor(variant) % 4) + 4) % 4;
  const accent = [BRAND.green, BRAND.light, '#7BE0BC', BRAND.pale][v];

  // ---------- PORTADA ----------
  if (kind === 'cover') {
    return (
      <AbsoluteFill style={{ backgroundColor: BRAND.dark, fontFamily: FONT }}>
        <AbsoluteFill>
          <Img
            src={imagen}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.5) saturate(1.1)', transform: 'scale(1.1)' }}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(8,22,15,0.55) 0%, rgba(8,22,15,0.35) 45%, rgba(8,22,15,0.92) 100%)' }} />
        <Glow x={540} y={520} size={760} color={`${BRAND.green}40`} />
        <AbsoluteFill style={{ padding: 80, justifyContent: 'space-between' }}>
          <Logo size={40} />
          <div>
            <div style={{ width: 90, height: 12, background: accent, borderRadius: 6, marginBottom: 40 }} />
            <div style={{ fontWeight: 900, fontSize: fitTitle(titulo), color: '#fff', lineHeight: 1.05, letterSpacing: -2, textShadow: '0 6px 30px rgba(0,0,0,0.6)' }}>
              {titulo}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: BRAND.pale, fontSize: 40, fontWeight: 700 }}>
            <span>Desliz&aacute;</span>
            <span style={{ fontSize: 52 }}>&rarr;</span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---------- CTA ----------
  if (kind === 'cta') {
    return (
      <AbsoluteFill style={{ backgroundColor: BRAND.dark, fontFamily: FONT }}>
        <Glow x={540} y={470} size={840} color={`${BRAND.green}45`} />
        <Glow x={760} y={1040} size={620} color={`${BRAND.light}30`} />
        <AbsoluteFill style={{ padding: 90, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: 40 }}><Logo size={52} /></div>
          <div style={{ fontSize: fitTitle(titulo) * 0.62, color: '#fff', fontWeight: 900, lineHeight: 1.1, letterSpacing: -1, marginBottom: 28, maxWidth: 880 }}>
            {titulo}
          </div>
          <div style={{ height: 12, width: 120, background: accent, borderRadius: 6, margin: '0 auto 40px' }} />
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 104, color: BRAND.light, letterSpacing: -2 }}>varka.tech</div>
          <div style={{ fontSize: 40, color: BRAND.pale, marginTop: 22 }}>Diagn&oacute;stico gratis &middot; escribinos por DM</div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---------- CONTENIDO ----------
  const badge = String(index).padStart(2, '0');
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.dark, fontFamily: FONT }}>
      <Glow x={880} y={180} size={620} color={`${BRAND.green}2e`} />
      <Glow x={160} y={1180} size={560} color={`${BRAND.light}22`} />
      <AbsoluteFill style={{ padding: 90, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={32} />
          <div style={{ fontSize: 30, color: 'rgba(225,245,238,0.5)', fontWeight: 700, letterSpacing: 1 }}>{badge} / {String(total).padStart(2, '0')}</div>
        </div>
        <div>
          <div style={{ fontSize: 150, fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: -4, marginBottom: 24 }}>{badge}</div>
          <div style={{ fontWeight: 900, fontSize: fitTitle(titulo), color: '#fff', lineHeight: 1.06, letterSpacing: -2, marginBottom: cuerpo ? 30 : 0 }}>
            {titulo}
          </div>
          {cuerpo ? (
            <div style={{ fontSize: fitBody(cuerpo), color: BRAND.pale, lineHeight: 1.4, fontWeight: 400, maxWidth: 880 }}>{cuerpo}</div>
          ) : null}
        </div>
        <Dots index={index} total={total} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};