import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageBubbleProps {
  content: string;
  sender: string;
  isOutgoing?: boolean;
  avatar?: string;
  isStreaming?: boolean;
}

export default function ChatMessageBubble({
  content,
  sender,
  isOutgoing = false,
  avatar,
  isStreaming = false,
}: MessageBubbleProps) {
  return (
    <Card className={`max-w-[80%] space-y-2 border-none bg-zinc-800 p-3 ${isOutgoing ? 'ml-auto' : ''}`}>
      <p className="text-white">
        {content}
        {isStreaming && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-zinc-400" />}
      </p>
      {!isOutgoing && (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar || '/placeholder.svg'} />
            <AvatarFallback>{sender.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-zinc-400">{sender}</span>
        </div>
      )}
    </Card>
  );
}
