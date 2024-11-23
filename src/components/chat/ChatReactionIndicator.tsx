import { type LucideIcon } from 'lucide-react';

interface ReactionIndicatorProps {
  icon: LucideIcon;
  text: string;
}

export default function ChatReactionIndicator({ icon: Icon, text }: ReactionIndicatorProps) {
  return (
    <div>
      <div className='mb-2 flex items-center gap-1 pl-2 text-sm text-muted-foreground'>
        <Icon className='size-3.5' />
        {text}
      </div>
    </div>
  );
}
