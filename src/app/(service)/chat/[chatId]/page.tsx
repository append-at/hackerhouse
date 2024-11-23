'use client';

import { useChat } from 'ai/react';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import ChatReactionIndicator from '@/components/chat/ChatReactionIndicator';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { Heart, LightbulbIcon, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  // FIXME: 여기서 유저 정보를 불러와야 함 @Chanhee

  return (
    <div className='flex h-full flex-col bg-black text-white'>
      <div className='flex-1 space-y-4 overflow-y-auto px-4 py-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className='space-y-2'
          >
            <ChatMessageBubble
              content={message.content ?? ''}
              sender={message.role === 'user' ? 'You' : 'AI'}
              isOutgoing={message.role === 'user'}
              isStreaming={index === messages.length - 1 && isLoading}
            />
            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className='flex flex-col gap-4'>
                {message.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state, args } = toolInvocation;
                  if (toolName === 'askForSharingInsight') {
                    return (
                      <div key={toolCallId}>
                        <ChatReactionIndicator
                          icon={LightbulbIcon}
                          text='Found Insight'
                        />
                        <Card className='max-w-[80%] space-y-2 border-none bg-zinc-800/50 p-3'>
                          <p className='text-white'>{args.quote}</p>
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-6 w-6'>
                              <AvatarFallback>{/* TODO: 유저 아바타 넣어야 함 */}HJ</AvatarFallback>
                            </Avatar>
                            <span className='text-sm text-zinc-400'>Replaceme Chanhee</span>
                          </div>
                        </Card>
                      </div>
                    );
                  }
                  // Partial call (is calling) - should render a loading indicator
                  return (
                    <ChatReactionIndicator
                      icon={LightbulbIcon}
                      text='Thinking...'
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <ChatInputArea
          value={input}
          onChange={handleInputChange}
          onReaction={(reaction) => console.log(reaction)}
        />
      </form>
    </div>
  );
}
