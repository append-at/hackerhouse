import { type LucideIcon } from 'lucide-react';

interface ReactionIndicatorProps {
  icon: LucideIcon;
  text: string;
}

export default function ChatReactionIndicator({ icon: Icon, text }: ReactionIndicatorProps) {
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-zinc-500">
        <Icon className="h-4 w-4" />
        {text}
      </div>
    </div>
  );
}
