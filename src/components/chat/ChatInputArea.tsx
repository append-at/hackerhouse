import React from 'react';
import { ArrowRightIcon, Heart, MessageSquare, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReaction: (reaction: string) => void;
}

export default function ChatInputArea({
  value,
  onChange,
  onReaction,
}: InputAreaProps) {
  return (
    <div className='px-6 py-3'>
      <div className='flex items-center gap-3'>
        <Input
          value={value}
          onChange={onChange}
          placeholder='Type a message'
          className='rounded-full border-none bg-zinc-800 pl-4 text-white placeholder:text-zinc-500'
        />
        <Button
          type='submit'
          size='icon'
          className='size-9 shrink-0 rounded-full shadow-none'
        >
          <ArrowRightIcon className='size-4' />
        </Button>
      </div>
    </div>
  );
}
