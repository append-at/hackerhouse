import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import { openai } from '@ai-sdk/openai';
import { jsonSchema, streamText, tool } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You're Hecky, the friend of ${user.username}.
User Profile: ${JSON.stringify(user)}

Rules:
- Keep your responses concise and helpful.
- Use casual, friendly language but be serious.
`,
    experimental_activeTools: ['askForSharingInsight'],
    messages,
    tools: {
      askForSharingInsight: tool({
        description:
          'Use this tool if user has shared something that you think is important, and you want to share to other users. It should have: 1. novel perspective 2. depth of understanding',
        parameters: jsonSchema<{ quote: string }>({
          type: 'object',
          properties: {
            quote: {
              type: 'string',
              description: 'The quote of the message user is said.',
            },
          },
          required: ['quote'],
        }),
        execute: async ({ quote }) => {
          return 'Confirmation sent to user. Now user should confirm.';
        },
      }),
      userConfirmedToShare: tool({
        description: 'Use this tool if user has confirmed to share the insight.',
        parameters: jsonSchema<{ quote: string }>({
          type: 'object',
          properties: {
            quote: {
              type: 'string',
              description: 'The quote of the message user is said.',
            },
          },
        }),
        execute: async ({ quote }) => {
          return 'Shared to other users.';
        },
      }),
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
