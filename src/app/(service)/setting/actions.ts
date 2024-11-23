'use server';

import { redirect } from 'next/navigation';

import { createServerSupabase } from '@/lib/db/supabase/server';

export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  redirect('/sign-in');
};
