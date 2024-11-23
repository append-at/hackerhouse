'use client';

import React, { useEffect, useState } from 'react';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { useUser } from '@/app/context';
import { dayjs } from '@/lib/date';
import { Tables } from '@/database.types';
import sendMessage from '@/app/(service)/people/dm/[otherUserName]/actions';
import { useSupabaseClient } from '@/hooks/use-supabase';

type Props = {
  initialMessages: Tables<'user_message'>[];
  otherUserName: string;
  conversationId: string;
};

const ChatInterface = ({ initialMessages, otherUserName, conversationId }: Props) => {
  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(conversationId, inputMessage);
  };

  useEffect(() => {
    const channelSubscribe = supabase
      .channel('user_message')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_message' }, (payload) => {
        const newMessage = payload.new as Tables<'user_message'>;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');
      })
      .subscribe();

    return () => {
      channelSubscribe.unsubscribe();
    };
  }, []);

  return (
    <div className='flex h-full flex-col bg-black text-white'>
      <div className='flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-orange-600/0 to-orange-600/10 px-6 py-8'>
        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const shouldShowDivider = !prev || dayjs(prev.at).isBefore(message.at, 'day');

          return (
            <div
              key={index}
              className='space-y-6'
            >
              {shouldShowDivider && (
                <div className='py-3 text-center text-xs text-muted-foreground'>
                  {dayjs(message.at).format('MMMM D, YYYY')}
                </div>
              )}

              <ChatMessageBubble
                content={message.message ?? ''}
                sender={message.user_id === user.id ? 'You' : otherUserName}
                isOutgoing={message.user_id !== user.id}
              />
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <ChatInputArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onReaction={(reaction) => console.log(reaction)}
        />
      </form>
    </div>
  );
};

export default ChatInterface;
