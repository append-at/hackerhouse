import { listMyAiConversations } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import ChatInterface from './_page';

const Page = async () => {
  const supabase = await createServerSupabase();
  const conversations = await listMyAiConversations(supabase);

  const sessionId = crypto.randomUUID();
  const initialMessages = conversations.flatMap((conversations) => conversations.data);

  return (
    <ChatInterface
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
};

export default Page;
