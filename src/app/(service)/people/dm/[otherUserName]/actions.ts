'use server';

import { createServerSupabase } from '@/lib/db/supabase/server';

export default async function sendMessage(conversationId: string, message: string) {
  const supabase = await createServerSupabase();

  await supabase.from('user_message').insert({
    conversation_id: conversationId,
    message,
  });
  await supabase.from('user_conversation').update({
    last_message_at: new Date().toISOString(),
    id: conversationId,
  });
}
