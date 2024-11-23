'use server';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

import { type Profile } from '../schema';

export const createUser = async (profile: Profile) => {
  const supabase = await createServerSupabase();

  const result = await supabase.from('user').upsert({
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    bio: profile.bio,
    username: profile.username,
    avatar_url: profile.avatarUrl,
  });

  if (result.error) {
    console.error('Error creating user:', result.error);
    throw new Error('Error creating user');
  }
};

export const setUserTopics = async (topics: string[]) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  await supabase
    .from('user')
    .update({ topics })
    .eq('id', user.id)
    .throwOnError();
};
