import { cva, type VariantProps } from 'class-variance-authority';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type Props = VariantProps<typeof chatBubbleVariants> & {
  content: string;
  className?: string;
  isStreaming?: boolean;
};

const chatBubbleVariants = cva(
  'inline-block max-w-xs rounded-xl text-left px-5 py-2.5',
  {
    variants: {
      theme: {
        normal: '',
        humanist: 'border-none',
      },
      by: {
        me: 'bg-muted',
        counterpart: 'bg-transparent',
      },
    },
    compoundVariants: [
      {
        theme: 'humanist',
        by: 'counterpart',
        class: 'font-display font-[350] leading-relaxed p-0 pl-2',
      },
    ],
    defaultVariants: {
      theme: 'normal',
      by: 'me',
    },
  },
);

export const ChatBubble = ({
  by,
  theme,
  content,
  className,
  isStreaming,
}: Props) => (
  <div
    className={cn(
      'chat-bubble flex',
      by === 'counterpart' ? '' : 'flex-row-reverse',
    )}
  >
    <Card className={cn(chatBubbleVariants({ by, theme }), className)}>
      <p className='text-foreground'>
        <Balancer>{content}</Balancer>
      </p>
    </Card>
    {isStreaming && (
      <span className='mx-3 size-2 shrink-0 animate-pulse rounded-full bg-orange-400/50' />
    )}
  </div>
);

export default ChatBubble;
