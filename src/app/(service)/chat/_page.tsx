'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import ChatReactionIndicator from '@/components/chat/ChatReactionIndicator';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { Heart, LightbulbIcon, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/app/context';
import { dayjs } from '@/lib/date';
import { syncChatConversations } from './actions';

type Props = {
  sessionId: string;
  initialMessages: any[];
};

const ChatInterface = ({ sessionId, initialMessages }: Props) => {
  const [trigger, setTriggerUpdate] = useState(0);

  const user = useUser();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages,
    onFinish() {
      // Force update the trigger because the `messages` are not updated
      setTriggerUpdate((prev) => prev + 1);
    },
    body: {
      sessionId,
    },
  });

  useEffect(() => {
    if (messages.length === initialMessages.length) {
      return;
    }

    syncChatConversations(sessionId, messages);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex h-full flex-col bg-black text-white'>
      <div className='flex-1 space-y-4 overflow-y-auto px-6 py-8'>
        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const shouldShowDivider = !prev || dayjs(prev.createdAt).isBefore(message.createdAt, 'day');

          return (
            <div
              key={index}
              className='space-y-6'
            >
              {shouldShowDivider && (
                <div className='py-3 text-center text-xs text-muted-foreground'>
                  {dayjs(message.createdAt).format('MMMM D, YYYY')}
                </div>
              )}

              <ChatMessageBubble
                content={message.content ?? ''}
                sender={message.role === 'user' ? 'You' : 'AI'}
                isOutgoing={message.role === 'user'}
                isStreaming={index === messages.length - 1 && isLoading}
              />
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className='flex flex-col gap-4'>
                  {message.toolInvocations.map((toolInvocation) => {
                    const { toolName, toolCallId, args } = toolInvocation;
                    if (toolName === 'askForSharingInsight') {
                      return (
                        <div key={toolCallId}>
                          <ChatReactionIndicator
                            icon={LightbulbIcon}
                            text='Found Insight'
                          />
                          <Card className='max-w-sm space-y-6 rounded-xl border-none bg-muted px-6 py-5'>
                            <p className='font-display text-white'>{args.quote}</p>
                            <div className='flex items-center gap-2'>
                              <Avatar className='size-4'>
                                <AvatarImage src={user.avatar_url ?? ''} />
                                <AvatarFallback>{user.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className='text-xs text-muted-foreground'>{user.name}</span>
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
          );
        })}
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
};

export default ChatInterface;
