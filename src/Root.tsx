import React from 'react';
import { Composition } from 'remotion';
import { Reel } from './Reel';

// Reel vertical 1080x1920, 15s a 30fps.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        texto: 'Actualizás precios a mano y te come horas | Varka los actualiza solos, sin planillas',
        hashtags: '#automatizacion #pymes #IA #varka',
        imagen: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1080',
        musicFile: 'prettyjohn1-no-copyright-music-498106.mp3',
        variant: 0,
      }}
    />
  );
};