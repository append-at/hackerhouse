import { createInsight } from '@/actions/insights';
import { getCurrentUser } from '@/lib/db/queries';
import { createServerSupabase } from '@/lib/db/supabase/server';
import { openai } from '@ai-sdk/openai';
import { jsonSchema, streamText, tool } from 'ai';
import { updateIntimacy } from '@/actions/updateIntimacy';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createServerSupabase();
  const user = await getCurrentUser(supabase);

  const lastMessages = JSON.stringify(messages.slice(-3));
  const askedForInsight = lastMessages.includes('askForSharingInsight');
  const confirmedToShareInsight = lastMessages.includes('userConfirmedToShareInsight');

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You're Hecky, the friend of ${user.username}.
  User Profile: ${JSON.stringify(user)}

  Rules:
  - Keep your responses concise and helpful.
  - Use casual, friendly language but be serious.

  Your another role is to share insight from the ${user.username} to other users:
  - Call askForSharingInsight if user has shared something that you think is important, and you want to share to other users.
  - Insight should have: 1. novel perspective 2. depth of understanding
  `,
    experimental_activeTools:
      askedForInsight && !confirmedToShareInsight ? ['userConfirmedToShareInsight'] : ['askForSharingInsight'],
    messages,
    tools: {
      askForSharingInsight: tool({
        description: 'Use this tool to share insight',
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
          return (
            'Confirmation sent to user. Now user should confirm.' +
            '(Please ask user to confirm (and must be include context (e.g. Share this insight with someone who needs it, or share it with a friend of mine because it sounds good.)'
          );
        },
      }),
      userConfirmedToShareInsight: tool({
        description: 'Use this tool if user has confirmed to share the insight.',
        parameters: jsonSchema<{ quote: string }>({
          type: 'object',
          properties: {
            quote: {
              type: 'string',
              description:
                'The quote of the message user is said- it should be the same as the quote in askForSharingInsight tool call.',
            },
          },
          required: ['quote'],
        }),
        execute: async ({ quote }) => {
          const insight = await createInsight(user.id, quote);
          await updateIntimacy(user.id, 'NEW_INSIGHT', `User shared insight: ${insight!.quote}`);
          return 'Share insight complete! Thank you for sharing the insight. Very helpful! Friendship increased!';
        },
      }),
    },
    experimental_continueSteps: true,
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}
