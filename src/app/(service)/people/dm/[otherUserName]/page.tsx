import { getCurrentUser, getPublicUser, listUserConversationMessages, listUserConversations } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import { redirect } from 'next/navigation';
import ChatInterface from '@/app/(service)/people/dm/[otherUserName]/_page';
import { HeaderWithDepth } from '@/app/(service)/_layouts/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileInterface from './_profile';

interface PageProps {
  params: Promise<{
    otherUserName: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { otherUserName } = await params;
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);
  const otherUser = await getPublicUser(supabase, { username: otherUserName });
  const conversations = await listUserConversations(supabase);
  const currentUserConversation = conversations.find(
    (conversation) =>
      (conversation.other_user_id === otherUser?.id && conversation.user_id === user.id) ||
      (conversation.other_user_id === user?.id && conversation.user_id === otherUser?.id),
  );

  if (!currentUserConversation) {
    redirect('/people');
  }

  const messages = await listUserConversationMessages(supabase, currentUserConversation.id);

  return (
    <div className='flex h-full flex-col'>
      <HeaderWithDepth
        path='/people'
        title={otherUser?.name ?? ''}
      />

      <Tabs
        defaultValue='conversations'
        className='flex min-h-0 w-full grow flex-col'
      >
        <div className='px-6 py-2'>
          <TabsList className='w-full'>
            <TabsTrigger
              className='w-full'
              value='conversations'
            >
              Conversations
            </TabsTrigger>
            <TabsTrigger
              className='w-full'
              value='profile'
            >
              Profile
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          className='!mt-0 min-h-0 grow'
          value='conversations'
        >
          <ChatInterface
            initialMessages={messages}
            otherUserName={otherUserName}
            conversationId={currentUserConversation.id}
          />
        </TabsContent>
        <TabsContent
          className='!mt-0 min-h-0 grow'
          value='profile'
        >
          <ProfileInterface user={otherUser!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
