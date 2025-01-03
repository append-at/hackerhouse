'use server';

import webpush from 'web-push';

import { createAdminSupabase } from '@/lib/db/supabase/admin';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

export interface SendPushForDailyQuestionProps {
  message: string;
  toTopics: string[];
}

export async function sendPushForDailyQuestion({
  message,
  toTopics,
}: SendPushForDailyQuestionProps) {
  const supabase = createAdminSupabase();

  // Get users and their subscriptions while creating AI conversations
  const { data: subscriptions, error } = await supabase.rpc(
    'send_push_for_daily_question',
    {
      to_topics: toTopics,
      message,
    },
  );

  if (error) {
    console.error('Error sending push notifications:', error);
    return;
  }

  // Send push notifications to all subscribed users
  const notifications = subscriptions.map(async ({ subscription }) => {
    try {
      await webpush.sendNotification(
        subscription as unknown as webpush.PushSubscription,
        JSON.stringify({
          title: 'Hacky',
          body: message,
        }),
        {
          vapidDetails: {
            subject: 'mailto:team@at.studio',
            publicKey: vapidPublicKey,
            privateKey: vapidPrivateKey,
          },
        },
      );
    } catch (err) {
      console.error('Error sending push notification:', err);
    }
  });

  // Wait for all notifications to be sent
  await Promise.all(notifications);
}
