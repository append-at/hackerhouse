import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

import { UserContextProvider } from '../context';
import Navigation from './_layouts/navigation';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  return (
    <UserContextProvider value={user}>
      <div className='flex h-dvh flex-col overflow-hidden'>
        <div className='min-h-0 grow'>{children}</div>
        <Navigation />
      </div>
    </UserContextProvider>
  );
};

export default Layout;
