'use server';

import { createServerSupabase } from '@/lib/db/supabase/server';
import { createAdminSupabase } from '@/lib/db/supabase/admin';
import { getCurrentUser } from '@/lib/db/queries';
import { type Profile } from './schema';

export const updateProfile = async (data: Profile) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  // Because the RLS bug, we need to use the admin client to update the user
  const db = createAdminSupabase();
  await db.from('user').update(data).eq('id', user.id).throwOnError();
};
