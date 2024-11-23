'use client';

import { Button } from '@/components/ui/button';

import GitHubIcon from './assets/github.module.svg';

const ContinueWithGitHub = () => {
  return (
    <Button size='lg'>
      <GitHubIcon className='size-6' />
      <span>Continue With GitHub</span>
    </Button>
  );
};

export default ContinueWithGitHub;
