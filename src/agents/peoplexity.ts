import { getCurrentIntimacy } from '@/actions/intimacy';
import { createAdminSupabase } from '@/lib/db/supabase/admin';
import { CoreMessage, generateText } from 'ai';
import OpenAI from 'openai';

export async function searchInsights(consideration: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const supabase = createAdminSupabase();

  // 1. RAG insights
  const { data: embedResult } = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: consideration,
    dimensions: 1536,
  });
  const queryEmbedding = embedResult[0].embedding;

  const { data: insightQueryResult } = await supabase.rpc('search_insights', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: 0.3,
    match_count: 5,
  });
  const insights = insightQueryResult || [];
  return insights;
}

/**
 * Search relevant insights and offer to introduce them to the user.
 */
export async function peoplexity(userId: string, situation: string, consideration: string) {
  const currentIntimacy = await getCurrentIntimacy(userId);

  // TODO: implement algorithm
  const allowedToConnectUser = Math.random() < currentIntimacy / 100;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 1. RAG insights
  const insights = await searchInsights(consideration);
  console.log(
    'insights',
    insights.map((i) => ({ username: i.username, quote: i.quote, similarity: i.similarity })),
  );

  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content:
          `I want to provide a helpful response to the user based on their current situation using relevant insights.
1. Please pick relavant insights (loaded by RAG vector search) with user's situation and consideration.
1.1. If there's any, please pick one and return it with the answer (message to user).
 - id: id of the insight
 - messageToUser: concise response to user. this is important.
    - you should act like you're casually sharing your friend's saying to the user.
    - ${allowedToConnectUser ? 'and you should suggest to introduce them to the user.' : ''}
    - be natural and consider the user's intimacy with you. (Intimacy is ${currentIntimacy}%)
    - refer the username as "my friend <name>"
    - example: (e.g. "I thought this might help - my friend John said <quote>. ${allowedToConnectUser ? `If you're interested, maybe I can connect you with him` : ''}")
1.2. If nothing looks relavant with situation & consideration, just return null.

Situation: ${situation}
Consideration: ${consideration}
Insights loaded by RAG vector search: ${JSON.stringify(insights)}`.trim(),
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'InsightsResponse',
        schema: {
          type: 'object',
          properties: {
            relevantInsight: {
              type: ['object', 'null'],
              properties: {
                id: { type: 'string' },
                messageToUser: { type: 'string', description: `Concise response to user.` },
              },
              required: ['id', 'messageToUser'],
            },
          },
          required: ['relevantInsight'],
        },
      },
    },
  });

  const parsed = JSON.parse(result.choices[0].message.content ?? '{}');
  if (!parsed.relevantInsight) {
    return null;
  }
  const { id, messageToUser } = parsed.relevantInsight;
  const insight = insights.find((i) => i.id === id)!;
  return {
    messageToUser,
    insight,
    allowedToConnectUser,
  };
}
