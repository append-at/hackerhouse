import { type LucideIcon } from 'lucide-react';

interface ReactionIndicatorProps {
  icon: LucideIcon;
  text: string;
}

export default function ChatReactionIndicator({
  icon: Icon,
  text,
}: ReactionIndicatorProps) {
  return (
    <div>
      <div className='mb-2 flex items-center gap-1.5 pl-2 text-sm font-medium text-muted-foreground'>
        <Icon className='size-4' />
        {text}
      </div>
    </div>
  );
}
