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
        texto: 'Tus precios se actualizan solos',
        hashtags: '#automatizacion #pymes #IA #varka',
        imagen:
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1080',
        musicFile: '',
        variant: 0,
      }}
    />
  );
};