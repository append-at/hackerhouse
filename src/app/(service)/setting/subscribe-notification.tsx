'use client';

import { useEffect, useState } from 'react';
import { BellIcon } from 'lucide-react';

import { useSupabaseClient } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/app/context';

import { subscribeUser, unsubscribeUser } from './actions';

/**
 * Asks the user to subscribe to push notifications.
 */
export default function SubscribePushNotificationButton() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  };

  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub.toJSON());
  };

  const unsubscribeFromPush = async () => {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  };

  const handleToggle = (checked: boolean) => {
    try {
      if (checked) {
        subscribeToPush();
      } else {
        unsubscribeFromPush();
      }

      setIsSubscribed(checked);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    supabase
      .from('push_subscription')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .then((data) => {
        const hasSubscription = !!data.data?.length;
        setIsSubscribed(hasSubscription);
      });
  }, []);

  return (
    <Button
      className='flex w-full items-center justify-start px-6 text-base'
      variant='ghost'
      size='lg'
      asChild
    >
      <div>
        <BellIcon />
        <span className='grow'>Notifications</span>

        <Switch
          checked={isSubscribed}
          disabled={isSubscribed}
          onCheckedChange={handleToggle}
        />
      </div>
    </Button>
  );
}

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
