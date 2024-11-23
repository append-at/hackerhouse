import React from 'react';
import { redirect, RedirectType } from 'next/navigation';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

export default async function SignInLayout({
  children,
}: React.PropsWithChildren) {
  const supabase = await createServerSupabase();

  try {
    await getCurrentUser(supabase);
  } catch (e) {
    return <>{children}</>;
  }

  redirect('/', RedirectType.replace);
}
