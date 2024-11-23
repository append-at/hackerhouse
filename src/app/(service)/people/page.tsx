import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RelativeTime } from '@/components/ui/relative-time';
import { getCurrentUser, listUserConversations } from '@/lib/db/queries';
import { createAdminSupabase } from '@/lib/db/supabase/admin';
import { createServerSupabase } from '@/lib/db/supabase/server';
import { Header } from '../_layouts/header';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const Page = async () => (
  <>
    <Header title='People' />

    <Suspense fallback={<ProfileFallback />}>
      <ProfileList />
    </Suspense>
  </>
);

const ProfileList = async () => {
  const supabase = await createServerSupabase();
  const [user, conversations] = await Promise.all([getCurrentUser(supabase), listUserConversations(supabase)]);

  const userIds = conversations.map((item) => (item.user_id === user.id ? item.other_user_id : item.user_id));
  const profileMap = await getUserProfiles(userIds);

  return conversations.length > 0 ? (
    <ul>
      {conversations.map((item) => {
        const counterpartUserId = item.user_id === user.id ? item.other_user_id : item.user_id;

        const profile = profileMap.get(counterpartUserId);
        if (!profile) return null;

        return (
          <li key={item.id}>
            <Link
              className='flex items-center gap-6 px-6 py-5 transition-colors hover:bg-muted/20'
              href={`/people/dm/${profile.username}`}
            >
              <Avatar className='round-full size-10'>
                <AvatarImage src={profile.avatar_url ?? ''} />
                <AvatarFallback>{profile.username.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className='w-full'>
                <div className='flex w-full items-center'>
                  <span className='grow text-base font-medium'>{profile.name}</span>
                  <span className='text-xs text-foreground/60'>
                    <RelativeTime at={item.last_message_at} />
                  </span>
                </div>

                <p className='text-sm text-muted-foreground'>
                  {'latest_message' in item ? (item.latest_message as string) : 'No messages yet'}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className='flex h-full grow items-center justify-center'>
      <p className='text-center text-base text-muted-foreground'>No connections yet</p>
    </div>
  );
};

const ProfileFallback = () => (
  <div className='flex h-full grow items-center justify-center'>
    <Spinner className='!size-8 text-white' />
  </div>
);

const getUserProfiles = async (id: string[]) => {
  const supabase = createAdminSupabase();
  const { data: users } = await supabase.from('user').select('*').in('id', id).throwOnError();

  const map = new Map(users?.map((user) => [user.id, user]));
  return map;
};

export default Page;
