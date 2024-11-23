'use client';

import { useState } from 'react';
import { registerPushNotification } from '@/utils/webPush';

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
    <button
      onClick={handleSubscribe}
      disabled={isSubscribed}
      className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
    >
      {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
    </button>
  );
}
