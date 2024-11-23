import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => (
  <header className='mb-8 flex h-20 items-center px-6'>
    <h1 className='text-3xl font-bold'>{title}</h1>
  </header>
);

type HeaderWithDepthProps = Props & {
  path: string;
};

export const HeaderWithDepth = ({ title, path }: HeaderWithDepthProps) => (
  <header className='flex h-12 items-center gap-2.5 px-6'>
    <Button
      variant='ghost'
      asChild
    >
      <Link href={path}>
        <ArrowLeftIcon className='!size-6' />
      </Link>
    </Button>
    <span className='text-base font-medium leading-none'>{title}</span>
  </header>
);
