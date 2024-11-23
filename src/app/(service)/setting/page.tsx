'use client';

import { Button } from '@/components/ui/button';
import { LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Header } from '../_layouts/header';
import { signOut } from './actions';
import SubscribePushNotificationButton from './subscribe-notification';

const Page = () => {
  const handleClickSignOut = async () => {
    signOut();
  };

  return (
    <>
      <Header title='Setting' />

      <div className='space-y-2'>
        <Button
          className='w-full justify-start px-6 text-base'
          variant='ghost'
          size='lg'
          asChild
        >
          <Link href='/setting/profile'>
            <UserIcon />
            <span>Profile</span>
          </Link>
        </Button>
        <SubscribePushNotificationButton />
        <Button
          className='w-full justify-start px-6 text-base text-rose-500'
          variant='ghost'
          size='lg'
          onClick={handleClickSignOut}
        >
          <LogOutIcon />
          <span>Sign Out</span>
        </Button>
      </div>
    </>
  );
};

export default Page;
