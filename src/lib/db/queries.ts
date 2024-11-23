import { Database, Tables } from '@/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

type MySupabaseClient = SupabaseClient<Database>;

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

