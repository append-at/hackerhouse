'use server';

import { createServerSupabase } from '@/lib/db/supabase/server';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  redirect('/sign-in');
};
