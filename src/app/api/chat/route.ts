import { aiChatAgent } from '@/agents/ai-chat';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  const { system, tools, activeTools } = await aiChatAgent(user, messages);
  const result = streamText({
    model: openai('gpt-4o'),
    system,
    messages,
    tools,
    experimental_activeTools: activeTools,
    experimental_continueSteps: true,
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}
