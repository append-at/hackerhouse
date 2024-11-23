import { getCurrentUser, listMyAiConversations } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import ChatInterface from './_page';
import { generateId } from '@/lib/utils';

const Page = async () => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);
  const conversations = await listMyAiConversations(supabase);

  const sessionId = crypto.randomUUID();
  const initialMessages = conversations.flatMap((conversations) => conversations.data);

  // if user first message
  if (initialMessages.length === 0) {
    const initialMessage = {
      id: generateId(16),
      role: 'assistant',
      content: `Hey ${user.name.split(' ')[0]}! How's it going?`,
      createdAt: new Date().toISOString(),
    };
    await supabase.from('ai_conversation').upsert({
      id: sessionId,
      user_id: user.id,
      data: [initialMessage],
    });

    initialMessages.push(initialMessage);
  }

  return (
    <ChatInterface
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
};

export default Page;
