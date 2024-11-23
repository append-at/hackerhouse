import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tables } from '@/database.types';

type Props = {
  user: Tables<'user'>;
};

const ProfileInterface = ({ user }: Props) => (
  <section className='space-6 px-6 py-8'>
    <div className='space-y-3 pb-8 text-center'>
      <Avatar className='mx-auto size-20'>
        <AvatarImage src={user.avatar_url ?? ''} />
        <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <p className='text-xl font-medium'>{user.name}</p>
    </div>

    <div className='whitespace-pre-line text-base'>{user.bio}</div>
  </section>
);

export default ProfileInterface;
