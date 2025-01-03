'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tables } from '@/database.types';

import { dayjs } from '@/lib/date';
import { useSupabaseClient } from '@/hooks/use-supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatInputArea from '@/components/chat/ChatInputArea';
import ChatMessageBubble from '@/components/chat/ChatMessageBubble';
import sendMessage from '@/app/(service)/people/dm/[otherUserName]/actions';
import { useUser } from '@/app/context';

type Props = {
  initialMessages: Tables<'user_message'>[];
  otherUser: Tables<'user'>;
  otherUserName: string;
  conversationId: string;
};

const ChatInterface = ({
  initialMessages,
  otherUser,
  conversationId,
}: Props) => {
  const chatListRef = useRef<HTMLDivElement>(null);

  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(conversationId, user.id, inputMessage);
  };

  useEffect(() => {
    const channelSubscribe = supabase
      .channel('user_message')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_message' },
        (payload) => {
          const newMessage = payload.new as Tables<'user_message'>;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setInputMessage('');
        },
      )
      .subscribe();

    return () => {
      channelSubscribe.unsubscribe();
    };
  }, []);

  useEffect(() => {
    chatListRef.current?.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className='flex h-full min-h-0 flex-col bg-black text-white'>
      <div
        ref={chatListRef}
        className='flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-orange-600/0 to-orange-600/10 px-6 pt-1 pb-8'
      >
        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const shouldShowDivider =
            !prev || dayjs(prev.at).isBefore(message.at, 'day');

          return (
            <div
              key={index}
              className='space-y-6'
            >
              {shouldShowDivider && (
                <div className='py-3 text-center text-xs text-muted-foreground'>
                  {dayjs(message.at).format('MMM D, YYYY')}
                </div>
              )}

              <ChatMessageBubble
                content={message.message ?? ''}
                by={message.user_id === user.id ? 'me' : 'counterpart'}
              >
                {!message.user_id && (
                  <Avatar className='size-7 mt-2 mr-3'>
                    <AvatarImage src='https://hackerhouse-ten.vercel.app/favicon-512.png' />
                    <AvatarFallback>
                      {otherUser.name?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                {!!message.user_id && message.user_id !== user.id && (
                  <Avatar className='size-7 mt-2 mr-3'>
                    <AvatarImage src={otherUser.avatar_url ?? ''} />
                    <AvatarFallback>
                      {otherUser.name?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </ChatMessageBubble>
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
