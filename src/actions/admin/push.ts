import webpush from 'web-push';

import { createAdminSupabase } from '@/lib/db/supabase/admin';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

interface SendPushProps {
  userIds: string[];
  title: string;
  body: string;
  url?: string;
}

export async function sendPush({ userIds, title, body, url }: SendPushProps) {
  const supabase = createAdminSupabase();

  const { data: subscriptions } = await supabase
    .from('push_subscription')
    .select('subscription')
    .in('user_id', userIds)
    .throwOnError();

  await Promise.all(
    (subscriptions ?? []).map(({ subscription }) => {
      webpush.sendNotification(
        subscription as unknown as webpush.PushSubscription,
        JSON.stringify({ title, body, url }),
        {
          vapidDetails: {
            subject: 'mailto:team@at.studio',
            publicKey: vapidPublicKey,
            privateKey: vapidPrivateKey,
          },
        },
      );
    }),
  );
}
