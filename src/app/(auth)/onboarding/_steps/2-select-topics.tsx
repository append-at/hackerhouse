'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SelectTopics = () => {
  const [topics, setTopics] = useState<string[]>([]);

  return (
    <>
      <header className='w-full text-center'>
        <h1 className='mx-auto max-w-sm text-3xl font-semibold'>Choose topics you’re interested in</h1>
      </header>

      <article className='flex w-full grow items-center'>
        <div className='fixed bottom-20 left-0 w-full text-center shadow-lg'>
          <Button
            className='h-12 w-64 rounded-xl text-base'
            disabled={!topics.length}
          >
            Start
          </Button>
        </div>
      </article>
    </>
  );
};

export default SelectTopics;
