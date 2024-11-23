import { createServerSupabase } from '@/lib/db/supabase/server';
import { getCurrentUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createServerSupabase();

  try {
    await getCurrentUser(supabase);
  } catch (error) {
    const err = error as Error;
    if (err.message.startsWith('Please sign in')) return redirect('/sign-in');
    if (err.message.startsWith('User profile')) return redirect('/onboarding');
  }

  return redirect('/people');
};

export default Page;
