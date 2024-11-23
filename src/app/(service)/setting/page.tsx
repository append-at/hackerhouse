'use client';

import Link from 'next/link';
import { FlaskConicalIcon, LogOutIcon, UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context';

import { Header } from '../_layouts/header';
import { signOut } from './actions';
import SubscribePushNotificationButton from './subscribe-notification';

const Page = () => {
  const user = useUser();

  const handleClickSignOut = async () => {
    signOut();
  };

  return (
    <>
      <Header title='Settings' />

      <div className='flex items-center gap-3 border-b border-solid border-border px-6 py-6'>
        <Avatar className='size-12'>
          <AvatarImage src={user.avatar_url ?? ''} />
          <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className='text-lg font-medium'>{user.name}</p>
      </div>

      <div className='space-y-2 py-3'>
        <Button
          className='w-full justify-start px-6 text-base'
          variant='ghost'
          size='lg'
          asChild
        >
          <Link href='/setting/profile'>
            <UserIcon />
            <span>Edit Profile</span>
          </Link>
        </Button>
        <Button
          className='w-full justify-start px-6 text-base'
          variant='ghost'
          size='lg'
          asChild
        >
          <Link href='/setting/lab'>
            <FlaskConicalIcon />
            <span>Lab</span>
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
