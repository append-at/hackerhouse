import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = React.SVGProps<SVGSVGElement>;

export const Spinner = ({ className, ...props }: Props) => (
  <Loader2Icon
    {...props}
    className={cn('animate-spin text-muted-foreground', className)}
  />
);
