'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleUserIcon, SpeechIcon, UsersIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/app/context';

const Navigation = () => {
  const user = useUser();

  return (
    <nav className='pb-safe shrink-0 text-center'>
      <NavigationItem path='/chat'>
        <SpeechIcon className='size-7' />
      </NavigationItem>
      <NavigationItem path='/people'>
        <UsersIcon className='size-7' />
      </NavigationItem>
      <NavigationItem path='/setting'>
        <Avatar className='size-7'>
          <AvatarImage src={user.avatar_url ?? ''} />
          <AvatarFallback>
            <CircleUserIcon className='size-7' />
          </AvatarFallback>
        </Avatar>
      </NavigationItem>
    </nav>
  );
};

type NavigationItemProps = {
  path: string;
  children: React.ReactNode;
};
const NavigationItem = ({ path, children }: NavigationItemProps) => {
  const pathname = usePathname();

  if (pathname.startsWith('/people/dm')) {
    return null;
  }

  return (
    <Link
      className='group inline-flex w-20 flex-col items-center gap-1.5 py-4 text-muted-foreground data-[active="true"]:text-foreground [&_.indicator]:data-[active="true"]:opacity-100'
      data-active={pathname.startsWith(path)}
      href={path}
    >
      {children}
      <div className='indicator size-1.5 rounded-full bg-orange-500 opacity-0' />
    </Link>
  );
};

export default Navigation;
