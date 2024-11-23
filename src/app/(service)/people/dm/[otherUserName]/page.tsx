import { getCurrentUser, getPublicUser, listUserConversationMessages, listUserConversations } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import { redirect } from 'next/navigation';
import ChatInterface from '@/app/(service)/people/dm/[otherUserName]/_page';
import { HeaderWithDepth } from '@/app/(service)/_layouts/header';

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
    <>
      <HeaderWithDepth
        path='/people'
        title={otherUser?.name ?? ''}
      />
      <ChatInterface
        initialMessages={messages}
        otherUserName={otherUserName}
        conversationId={currentUserConversation.id}
      />
    </>
  );
};

export default Page;
