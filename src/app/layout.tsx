import type { Metadata, Viewport } from 'next';
import { Provider as WrapProvider } from 'react-wrap-balancer';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

import * as fonts from './fonts';
import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Hackerhouse',
  description: 'Make one AI friend to get a million friends',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => (
  <html>
    <body
      className={cn(
        'dark',
        fonts.literata.variable,
        fonts.inter.variable,
        fonts.jetbrainsMono.variable,
      )}
    >
      <WrapProvider preferNative={false}>
        <Providers>
          <main className='mx-auto min-h-dvh max-w-md sm:border-x sm:border-solid sm:border-border'>
            {children}
          </main>
          <Toaster />
        </Providers>
      </WrapProvider>
    </body>
  </html>
);

export default Layout;
