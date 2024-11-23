'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContinueWithGitHub = dynamic(() => import('./continue-with-github'), { ssr: false });

const Page = () => {
  return (
    <section className='flex h-dvh flex-col items-center justify-center text-center'>
      <div className='mb-20'>
        <h1 className='mb-1 font-display text-5xl font-extrabold tracking-tighter'>Hackerhouse</h1>
        <p className='text-sm text-foreground/60'>Clubhouse for Hackers</p>
      </div>

      <Suspense>
        <ContinueWithGitHub />
      </Suspense>
    </section>
  );
};

export default Page;
