import { Json } from '@/database.types';

import { createBrowserSupabase } from '@/lib/db/supabase/browser';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

export async function registerPushNotification() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return;
  }

  try {
    // Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered');

    // Check permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    // Get push subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Store subscription in database
    const supabase = createBrowserSupabase();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('please sign in');
    }
    await supabase.from('push_subscription').insert({
      subscription: subscription.toJSON() as Json,
      user_id: user.user.id,
    });

    console.log('Push notification subscription successful');
    return subscription;
  } catch (err) {
    console.error('Error registering push notification:', err);
    throw err;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
