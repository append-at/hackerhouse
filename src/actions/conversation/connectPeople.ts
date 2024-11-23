'use server';

import { createAdminSupabase } from '@/lib/db/supabase/admin';
import { sendPush } from '../admin/push';
import OpenAI from 'openai';
import { createUserConversation } from '@/lib/db/queries';
import { Tables } from '@/database.types';

interface SendMessageToConversationProps {
  conversation: Tables<'user_conversation'>;
  fromUserId: string | 'ai';
  fromUsername: string;
  message: string;
}

export async function sendMessageToConversation({
  conversation,
  fromUserId,
  fromUsername,
  message,
}: SendMessageToConversationProps): Promise<void> {
  const supabase = createAdminSupabase();
  const { user_id: userId, other_user_id: otherUserId } = conversation;

  await supabase.from('user_message').insert({
    conversation_id: conversation.id,
    user_id: fromUserId === 'ai' ? null : fromUserId,
    message,
  });

  // update the last_message_at field on the conversation (where id = conversation.id)
  await supabase
    .from('user_conversation')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversation.id);

  // if message is from ai, alert both users
  await sendPush({
    userIds: fromUserId === 'ai' ? [userId, otherUserId] : [otherUserId],
    title: fromUsername,
    body: message,
    url: `/conversation/${conversation.id}`,
  });
}

export interface ConnectPeopleProps {
  userId: string;
  otherUserId: string;
  reason: string;
}

export async function connectPeople({ userId, otherUserId, reason }: ConnectPeopleProps): Promise<void> {
  const supabase = createAdminSupabase();
  const openai = new OpenAI();

  const conversation = await createUserConversation(supabase, { user_id: userId, other_user_id: otherUserId });

  const { data: user } = await supabase.from('user').select('username').eq('id', otherUserId).maybeSingle();
  const { data: otherUser } = await supabase.from('user').select('username').eq('id', userId).maybeSingle();

  if (!user || !otherUser) {
    throw new Error('User not found');
  }

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `I'm Hecky, the networking matchmaker.
I'm introducing ${user.username} and ${otherUser.username} because ${reason}.
Please write a introduction message to ${otherUser.username} that says you've been connected with them because ${reason}.

Rules:
- Keep it short and sweet.
- Make it personal.
- Make it interesting.
- One sentence, be concise.
`.trim(),
      },
    ],
  });
  const message = choices[0].message.content!;

  await sendMessageToConversation({
    conversation,
    fromUserId: 'ai',
    fromUsername: 'Hecky',
    message,
  });
}