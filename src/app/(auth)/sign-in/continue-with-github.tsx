'use client';

import { useSearchParams } from 'next/navigation';

import { useSupabaseClient } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';

import GitHubIcon from './assets/github.module.svg';

const ContinueWithGitHub = () => {
  const supabase = useSupabaseClient();
  const searchParams = useSearchParams();

  const handleClick = async () => {
    const next = new URL(`${window.location.origin}/auth/callback`);
    next.searchParams.set('next', searchParams.get('next') ?? '/');

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: next.toString(),
      },
    });
  };

  return (
    <Button
      type='button'
      size='lg'
      onClick={handleClick}
    >
      <GitHubIcon className='size-6' />
      <span>Continue With GitHub</span>
    </Button>
  );
};

export default ContinueWithGitHub;
