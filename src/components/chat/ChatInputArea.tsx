import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Heart, ArrowRightIcon } from 'lucide-react';
import React from 'react';

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReaction: (reaction: string) => void;
}

export default function ChatInputArea({ value, onChange, onReaction }: InputAreaProps) {
  return (
    <div className='px-6 py-3'>
      <div className='flex items-center gap-2'>
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
      {/* <div className="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onReaction('insight')}
          className="text-zinc-400 hover:text-white"
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          Insight
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onReaction('friendship')}
          className="text-zinc-400 hover:text-white"
        >
          <Heart className="mr-1 h-4 w-4" />
          Friendship
        </Button>
      </div> */}
    </div>
  );
}
