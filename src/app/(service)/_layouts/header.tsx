import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Omit<React.HTMLProps<HTMLElement>, 'title' | 'path'> & {
  title: React.ReactNode;
};

export const Header = ({ title, className, ...props }: Props) => (
  <header
    {...props}
    className={cn('pt-safe flex h-20 shrink-0 items-center px-6', className)}
  >
    <h1 className='text-3xl font-semibold'>{title}</h1>
  </header>
);

type HeaderWithDepthProps = Props & {
  path: string;
};

export const HeaderWithDepth = ({ title, path, className, ...props }: HeaderWithDepthProps) => (
  <header
    {...props}
    className={cn('pt-safe flex h-12 shrink-0 items-center gap-2.5 px-6', className)}
  >
    <Button
      variant='ghost'
      size='icon'
      asChild
    >
      <Link href={path}>
        <ArrowLeftIcon className='!size-6' />
      </Link>
    </Button>
    <span className='text-base font-medium leading-none'>{title}</span>
  </header>
);
