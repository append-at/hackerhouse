'use server';

import { createServerSupabase } from '@/lib/db/supabase/server';
import { type Profile } from '../schema';
import { getCurrentUser } from '@/lib/db/queries';
import { createAdminSupabase } from '@/lib/db/supabase/admin';

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

  // Because the RLS bug, we need to use the admin client to update the user
  const db = createAdminSupabase();
  await db.from('user').update({ topics }).eq('id', user.id).throwOnError();
};
