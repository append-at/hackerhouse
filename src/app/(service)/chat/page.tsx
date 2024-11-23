import { getCurrentUser, listMyAiConversations } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import ChatInterface from './_page';
import { generateId } from 'ai';
import { Header } from '../_layouts/header';

const Page = async () => {
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);
  const conversations = await listMyAiConversations(supabase);

  let sessionId: string = '';
  const initialMessages = conversations.flatMap((conversations) => conversations.data);

  // if user first message
  if (conversations.length === 0) {
    sessionId = crypto.randomUUID();
    const initialMessage = {
      id: generateId(),
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
  } else {
    sessionId = conversations[conversations.length - 1].id;
  }

  return (
    <div className='flex h-full flex-col'>
      <Header title='Chat' />
      <ChatInterface
        sessionId={sessionId}
        initialMessages={initialMessages}
      />
    </div>
  );
};

export default Page;
