'use client';

import { useState } from 'react';
import { registerPushNotification } from '@/utils/webPush';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BellIcon } from 'lucide-react';

/**
 * Asks the user to subscribe to push notifications.
 */
export default function SubscribePushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    try {
      await registerPushNotification();
      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe:', err);
    }
  };

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
          onCheckedChange={handleSubscribe}
        />
      </div>
    </Button>
  );
}
