import { createInsight } from '@/actions/insights';
import { updateIntimacy } from '@/actions/intimacy';
import { Tables } from '@/database.types';
import { jsonSchema, Message, tool } from 'ai';
import { peoplexity } from './peoplexity';
import { connectPeople } from '@/actions/conversation/connectPeople';

export async function aiChatAgent(user: Tables<'user'>, messages: Message[]) {
  const lastMessages = JSON.stringify(messages.slice(-3));
  const askedForInsight = lastMessages.includes('askForSharingInsight');
  const confirmedToShareInsight = lastMessages.includes('userConfirmedToShareInsight');
  const allowedToConnectUser = lastMessages.includes('"allowedToConnectUser":true');

  const system = `You're Hecky, the friend of ${user.username}.
User Profile: ${JSON.stringify(user)}

Rules:
- Keep your responses concise and helpful.
- Use casual, friendly language but be serious.

Your another role is to share insight from the ${user.username} to other users:
- Call askForSharingInsight if user has shared something that you think is important, and you want to share to other users.
- Insight should have: 1. novel perspective 2. depth of understanding

Your another role is to answer considerately to user's consideration/questions from your other friends' insights.
Call searchForInsight if user has any concern/question/consideration.
- If there's no relavant insight, just answer the question as best as you can. (don't say that you've searched for insights but found nothing!)
- If allowedToConnectUser is true, you can introduce your friend to user by calling connectPeople tool after getting the explicit consent from user.
`;
  const tools = {
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
    searchForInsight: tool({
      description: 'Use this tool to search for insight',
      parameters: jsonSchema<{ situation: string; consideration: string }>({
        type: 'object',
        properties: {
          situation: { type: 'string' },
          consideration: { type: 'string' },
        },
        required: ['situation', 'consideration'],
      }),
      execute: async ({ situation, consideration }) => {
        return await peoplexity(user.id, situation, consideration);
      },
    }),
    connectPeople: tool({
      description: 'Use this tool to connect user to another user',
      parameters: jsonSchema<{ userId: string; reason: string }>({
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'UUID of the user who gave the insight. Otherwise will be rejected' },
          reason: { type: 'string', description: 'Reason for connection (will be shown to the user. should look authentic and interesting)' },
        },
        required: ['userId'],
      }),
      execute: async ({ userId, reason }) => {
        return await connectPeople({ userId: user.id, otherUserId: userId, reason });
      },
    }),
  };

  const activeTools: (keyof typeof tools)[] = askedForInsight
    ? ['userConfirmedToShareInsight']
    : allowedToConnectUser
      ? ['connectPeople', 'searchForInsight', 'askForSharingInsight']
      : ['searchForInsight', 'askForSharingInsight'];

  return {
    system,
    tools,
    activeTools,
  };
}
