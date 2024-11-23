'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context';

import { testPushMessage } from './actions';

const Page = () => {
  const user = useUser();

  const handleClickPush = async () => {
    await testPushMessage(user.id);
  };

  return (
    <>
      <Button onClick={handleClickPush}>Send Push</Button>
    </>
  );
};

export default Page;
