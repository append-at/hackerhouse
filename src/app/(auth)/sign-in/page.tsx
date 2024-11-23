'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import Logo from '@/assets/logo.module.svg';

const ContinueWithGitHub = dynamic(() => import('./continue-with-github'), { ssr: false });

const Page = () => {
  return (
    <section className='flex h-dvh flex-col items-center justify-center text-center'>
      <div className='mb-20'>
        <h1 className='font-display mb-2 text-5xl font-extrabold tracking-tighter'>
          <Logo className='mx-auto h-10 w-auto' />
        </h1>
        <p className='text-base text-foreground/60'>Make one AI friend to get a million friends</p>
      </div>

      <Suspense>
        <ContinueWithGitHub />
      </Suspense>
    </section>
  );
};

export default Page;
