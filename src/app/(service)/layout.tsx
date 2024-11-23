import { createServerSupabase } from '@/lib/db/supabase/server';
import { UserContextProvider } from '../context';
import Navigation from './_layouts/navigation';
import { getCurrentUser } from '@/lib/db/queries';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  return (
    <UserContextProvider value={user}>
      <div className='flex h-dvh flex-col'>
        <div className='min-h-0 grow'>{children}</div>
        <Navigation />
      </div>
    </UserContextProvider>
  );
};

export default Layout;
