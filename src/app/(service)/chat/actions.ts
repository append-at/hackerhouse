'use server';

import { type Json } from '@/database.types';
import { Message } from 'ai';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

export const syncChatConversations = async (
  chatInstantId: string,
  data: Message[],
) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  const response = await supabase
    .from('ai_conversation')
    .upsert({
      id: chatInstantId,
      user_id: user.id,
      data: data as unknown as Json,
    })
    .select()
    .throwOnError();

  return response.data?.at(-1);
};
