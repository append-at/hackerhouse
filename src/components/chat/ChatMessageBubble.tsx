import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  sender: string;
  isOutgoing?: boolean;
  avatar?: string;
  isStreaming?: boolean;
  className?: string;
}

export default function ChatMessageBubble({
  content,
  sender,
  isOutgoing = false,
  avatar,
  isStreaming = false,
  className,
}: MessageBubbleProps) {
  return (
    <div className={isOutgoing ? 'text-right' : 'text-left'}>
      <Card
        className={cn(
          'inline-block max-w-xs space-y-2 rounded-xl border-none text-left',
          isOutgoing ? 'ml-auto bg-zinc-800 px-5 py-4' : 'bg-transparent pl-2 pt-4 font-display',
          className,
        )}
      >
        <p className='text-foreground'>
          {content}
          {isStreaming && <span className='ml-1 inline-block h-4 w-2 animate-pulse bg-zinc-400' />}
        </p>
        {/*{!isOutgoing && (*/}
        {/*  <div className='flex items-center gap-2'>*/}
        {/*    <Avatar className='h-6 w-6'>*/}
        {/*      <AvatarImage src={avatar || '/placeholder.svg'} />*/}
        {/*      <AvatarFallback>{sender.slice(0, 2).toUpperCase()}</AvatarFallback>*/}
        {/*    </Avatar>*/}
        {/*    <span className='text-sm text-zinc-400'>{sender}</span>*/}
        {/*  </div>*/}
        {/*)}*/}
      </Card>
    </div>
  );
}
