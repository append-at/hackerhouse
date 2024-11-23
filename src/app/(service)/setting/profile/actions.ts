'use server';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

import { type Profile } from './schema';

export const updateProfile = async (data: Profile) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  await supabase.from('user').update(data).eq('id', user.id).throwOnError();
};
