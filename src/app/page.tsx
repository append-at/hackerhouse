import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/sign-in');
  }

  const { data: userData } = await supabase.from('user').select('*').eq('id', user.id).maybeSingle();
  if (!userData) {
    return redirect('/onboarding');
  }

  return redirect('/people');
};

export default Page;
