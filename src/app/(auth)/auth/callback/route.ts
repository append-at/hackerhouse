import { redirect } from 'next/navigation';

import { createServerSupabase } from '@/lib/db/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const next = decodeURIComponent(searchParams.get('next') ?? '/');

  if (!code) {
    return redirect('/');
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // return the user to an error page with instructions
  if (error) {
    return redirect('/auth/auth-code-error');
  }

  // original origin before load balancer
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
  if (isLocalEnv) {
    return redirect('/');
  }
  if (forwardedHost) {
    return redirect(`https://${forwardedHost}${next}`);
  }
  return redirect(next);
}
