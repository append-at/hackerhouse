import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => ({
  name: 'Hackerhouse',
  short_name: 'Hackerhouse',
  description: 'Clubhouse for hackers',
  start_url: '/',
  display: 'standalone',
  background_color: '#09090B',
  theme_color: '#F97316',
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
});

export default manifest;
