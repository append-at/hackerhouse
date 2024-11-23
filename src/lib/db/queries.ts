import { Database, Tables, TablesInsert } from '@/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

type MySupabaseClient = SupabaseClient<Database>;

export async function getPublicUser(supabase: MySupabaseClient, filter: Partial<Tables<'user'>>) {
  const { data } = await supabase.from('user').select('*').match(filter).limit(1).maybeSingle().throwOnError();

  return data;
}

export async function getCurrentUser(supabase: MySupabaseClient): Promise<Tables<'user'>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Please sign in to continue');
  }
  const { data: userData } = await supabase.from('user').select('*').eq('id', user.id).maybeSingle().throwOnError();

  if (!userData) {
    // This should never happen- user should always have a
    throw new Error('User profile not found');
  }
  return userData;
}

export async function createUserConversation(
  supabase: MySupabaseClient,
  insertData: TablesInsert<'user_conversation'>,
): Promise<Tables<'user_conversation'>> {
  const { data } = await supabase.from('user_conversation').insert(insertData).select().single().throwOnError();
  if (!data) {
    throw new Error('Failed to create conversation');
  }
  return data;
}

export type UserConversationWithLatestMessage = Tables<'user_conversation'> & { latest_message?: string };

/**
 * Used on the user conversations page
 */
export async function listUserConversations(supabase: MySupabaseClient): Promise<Tables<'user_conversation'>[]> {
  const { id: userId } = await getCurrentUser(supabase);
  const userConversations = await supabase
    .from('user_conversation')
    .select('*')
    .or(`user_id.eq.${userId},other_user_id.eq.${userId}`)
    .throwOnError()
    .then((res) => res.data ?? []);

  return Promise.all(
    userConversations.map(async (conversation) => {
      const { data: latestMessage } = await supabase
        .from('user_message')
        .select('message')
        .eq('conversation_id', conversation.id)
        .order('at', { ascending: false })
        .limit(1)
        .throwOnError()
        .maybeSingle();
      return { ...conversation, latest_message: latestMessage?.message };
    }),
  );
}

export async function listUserConversationMessages(supabase: MySupabaseClient, conversationId: string) {
  return supabase
    .from('user_message')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('at', { ascending: true })
    .throwOnError()
    .then((res) => res.data ?? []);
}

export async function getAiConversation(
  supabase: MySupabaseClient,
  conversationId: string,
): Promise<Tables<'ai_conversation'> | undefined> {
  return supabase
    .from('ai_conversation')
    .select('*')
    .eq('id', conversationId)
    .maybeSingle()
    .throwOnError()
    .then((res) => res.data ?? undefined);
}

export async function listMyAiConversations(supabase: MySupabaseClient): Promise<Tables<'ai_conversation'>[]> {
  const { id: userId } = await getCurrentUser(supabase);
  return supabase
    .from('ai_conversation')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false })
    .throwOnError()
    .then((res) => res.data ?? []);
}
