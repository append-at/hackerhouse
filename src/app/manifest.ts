import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
  console.log('testing');
  return {
    name: 'Hackerhouse',
    short_name: 'Hackerhouse',
    description: 'Clubhouse for hackers',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#F97316',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
};

export default manifest;
