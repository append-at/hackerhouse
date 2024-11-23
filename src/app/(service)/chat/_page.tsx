'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import ChatReactionIndicator from '@/components/chat/ChatReactionIndicator';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { HeartIcon, LightbulbIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/app/context';
import { dayjs } from '@/lib/date';
import { syncChatConversations } from './actions';
import { cn } from '@/lib/utils';
import Balancer from 'react-wrap-balancer';

type QuoteCardProps = {
  quote: string;
  avatar_url?: string;
  username: string;
};

const QuoteCard = ({ quote, avatar_url, username }: QuoteCardProps) => (
  <Card
    className={cn(
      'mb-5 inline-block space-y-6 rounded-xl border-none bg-muted py-6 pl-6 pr-12',
      'bg-gradient-to-bl from-indigo-200 via-red-200 to-yellow-100',
      'shadow-inner shadow-foreground/50',
    )}
  >
    <p className='font-display text-lg font-medium leading-snug tracking-tight text-primary-foreground'>
      <Balancer>{quote}</Balancer>
    </p>
    <div className='flex items-center gap-2'>
      <Avatar className='size-4'>
        <AvatarImage src={avatar_url ?? ''} />
        <AvatarFallback>{username.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className='text-xs text-primary-foreground/60'>{username}</span>
    </div>
  </Card>
);

type Props = {
  sessionId: string;
  initialMessages: any[];
};

const ChatInterface = ({ sessionId, initialMessages }: Props) => {
  const chatListRef = useRef<HTMLDivElement>(null);
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
    chatListRef.current?.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (messages.length === initialMessages.length) {
      return;
    }

    syncChatConversations(sessionId, messages);
  }, [trigger, messages]);

  return (
    <div className='flex h-full min-h-0 flex-col bg-black text-white'>
      <div
        ref={chatListRef}
        className='flex-1 overflow-y-auto bg-gradient-to-b from-orange-600/0 to-orange-600/10 px-6 py-8'
      >
        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const shouldShowDivider = !prev || dayjs(prev.createdAt).isBefore(message.createdAt, 'day');

          return (
            <div
              key={index}
              className={cn(message.content && !message.toolInvocations?.length && 'mb-8')}
            >
              {shouldShowDivider && (
                <div className='py-3 text-center text-xs text-muted-foreground'>
                  {dayjs(message.createdAt).format('MMMM D, YYYY')}
                </div>
              )}

              {message.content && (
                <ChatMessageBubble
                  content={message.content}
                  by={message.role === 'user' ? 'me' : 'counterpart'}
                  theme='humanist'
                  isStreaming={index === messages.length - 1 && isLoading}
                />
              )}

              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className='flex w-fit flex-col gap-4'>
                  {message.toolInvocations.map((toolInvocation) => {
                    const { toolName, toolCallId, args, state } = toolInvocation;
                    if (toolName === 'askForSharingInsight') {
                      return (
                        <div key={toolCallId}>
                          <ChatReactionIndicator
                            icon={LightbulbIcon}
                            text='Found Insight'
                          />
                          <QuoteCard
                            quote={args.quote}
                            avatar_url={user.avatar_url || undefined}
                            username={user.username}
                          />
                        </div>
                      );
                    } else if (toolName === 'userConfirmedToShareInsight') {
                      return (
                        <div key={toolCallId}>
                          <ChatReactionIndicator
                            icon={HeartIcon}
                            text='Friendship Increased'
                          />
                        </div>
                      );
                    } else if (toolName === 'searchForInsight') {
                      if (state !== 'result') {
                        return (
                          <ChatReactionIndicator
                            icon={LightbulbIcon}
                            text='Thinking...'
                          />
                        );
                      }
                      const { insight } = toolInvocation.result as {
                        insight: {
                          id: string;
                          bio: string;
                          quote: string;
                          user_id: string;
                          username: string;
                          avatar_url: string;
                        };
                      };
                      return (
                        <QuoteCard
                          quote={insight.quote}
                          avatar_url={insight.avatar_url}
                          username={insight.username}
                        />
                      );
                    }
                    return (
                      <>
                        <ChatReactionIndicator
                          icon={LightbulbIcon}
                          text='Thinking...'
                        />
                        {JSON.stringify({ toolName, args, result: (toolInvocation as any).result }, null, 2)}
                      </>
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
