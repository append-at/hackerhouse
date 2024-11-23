'use client';

import { useEffect, useState } from 'react';
import { dayjs } from '@/lib/date';

type Props = {
  at: string;
};
export const RelativeTime = ({ at }: Props) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <time
      key={timeElapsed}
      dateTime={at}
      suppressHydrationWarning
    >
      {dayjs(at).fromNow()}
    </time>
  );
};
