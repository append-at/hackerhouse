import { Tables } from '@/database.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

type Props = {
  user: Tables<'user'>;
};

const ProfileInterface = ({ user }: Props) => (
  <section className='space-6 px-6 py-16'>
    <div className='space-y-3 pb-8 text-center'>
      <Avatar className='mx-auto size-20'>
        <AvatarImage src={user.avatar_url ?? ''} />
        <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <p className='text-2xl font-medium'>{user.name}</p>
    </div>

    <div>
      <Label>Bio</Label>
      <p className='whitespace-pre-line text-sm text-foreground/80'>
        {user.bio}
      </p>
    </div>
  </section>
);

export default ProfileInterface;
