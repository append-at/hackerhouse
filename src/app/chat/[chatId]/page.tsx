'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import ChatReactionIndicator from '@/components/chat/ChatReactionIndicator';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { Heart, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const [reactions, setReactions] = useState<{ [key: number]: string }>({});

  const handleReaction = (index: number, reaction: string) => {
    setReactions((prev) => ({ ...prev, [index]: reaction }));
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-black text-white">
      {/* Chat Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
        {messages.map((message, index) => (
          <div key={index} className="space-y-2">
            <ChatMessageBubble
              content={message.content}
              sender={message.role === 'user' ? 'You' : 'AI'}
              isOutgoing={message.role === 'user'}
              avatar={message.role === 'assistant' ? '/ai-avatar.png' : undefined}
              isStreaming={index === messages.length - 1 && isLoading}
            />
            {reactions[index] && (
              <ChatReactionIndicator
                icon={reactions[index] === 'insight' ? MessageSquare : Heart}
                text={reactions[index] === 'insight' ? 'Found Insight' : 'Friendship Increased'}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <ChatInputArea
          value={input}
          onChange={handleInputChange}
          onReaction={(reaction) => handleReaction(messages.length - 1, reaction)}
        />
      </form>
    </div>
  );
}
