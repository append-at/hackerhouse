'use server';

import { redirect } from 'next/navigation';
import type { Json } from '@/database.types';
import webpush from 'web-push';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

export const signOut = async () => {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  redirect('/sign-in');
};

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:team@at.studio',
  vapidPublicKey,
  vapidPrivateKey,
);

export const subscribeUser = async (sub: PushSubscriptionJSON) => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  await supabase
    .from('push_subscription')
    .insert({
      user_id: user.id,
      subscription: sub as Json,
    })
    .throwOnError();
};

export const unsubscribeUser = async () => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  await supabase
    .from('push_subscription')
    .delete()
    .eq('user_id', user.id)
    .throwOnError();
};
