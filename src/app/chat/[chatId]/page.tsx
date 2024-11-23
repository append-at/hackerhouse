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

  const parseQuoteMessage = (content: string) => {
    const match = content.match(
      /<quote_message_result><quote>(.*?)<\/quote><author>(.*?)<\/author><\/quote_message_result>/,
    );
    if (match) {
      return {
        quote: match[1],
        author: match[2],
      };
    }
    return {
      plainText: content.replace(/<quote_message_result>.*?<\/quote_message_result>/g, ''),
    };
  };

  return (
    <div className='flex h-[100dvh] flex-col bg-black text-white'>
      <div className='flex-1 space-y-4 overflow-y-auto px-4 py-2'>
        {messages.map((message, index) => {
          const parsed = parseQuoteMessage(message.content);
          const hasQuote = 'quote' in parsed;

          return (
            <div
              key={index}
              className='space-y-2'
            >
              <ChatMessageBubble
                content={hasQuote ? (parsed.plainText ?? '') : (message.content ?? '')}
                sender={message.role === 'user' ? 'You' : 'AI'}
                isOutgoing={message.role === 'user'}
                isStreaming={index === messages.length - 1 && isLoading}
              />
              {hasQuote && (
                <>
                  <ChatReactionIndicator
                    icon={LightbulbIcon}
                    text='Found Insight'
                  />
                  <Card className='max-w-[80%] space-y-2 border-none bg-zinc-800/50 p-3'>
                    <p className='text-white'>{parsed.quote}</p>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-6 w-6'>
                        <AvatarFallback>{parsed.author?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm text-zinc-400'>{parsed.author}</span>
                    </div>
                  </Card>
                </>
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
}
