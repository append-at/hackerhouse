import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

type Props = React.SVGProps<SVGSVGElement>;

export const Spinner = ({ className, ...props }: Props) => (
  <Loader2Icon
    {...props}
    className={cn('animate-spin text-muted-foreground', className)}
  />
);
