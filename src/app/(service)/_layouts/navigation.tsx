'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleUserIcon, SpeechIcon, UsersIcon } from 'lucide-react';

const Navigation = () => (
  <nav className='shrink-0 text-center'>
    <NavigationItem path='/chat'>
      <SpeechIcon className='size-6' />
    </NavigationItem>
    <NavigationItem path='/people'>
      <UsersIcon className='size-6' />
    </NavigationItem>
    <NavigationItem path='/setting'>
      <CircleUserIcon className='size-6' />
    </NavigationItem>
  </nav>
);

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
      className='group inline-flex w-20 flex-col items-center gap-1 py-4 text-muted-foreground data-[active="true"]:text-foreground [&_.indicator]:data-[active="true"]:opacity-100'
      data-active={pathname.startsWith(path)}
      href={path}
    >
      {children}
      <div className='indicator size-1 rounded-full bg-orange-500 opacity-0' />
    </Link>
  );
};

export default Navigation;
