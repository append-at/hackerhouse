'use server';

import OpenAI from 'openai';

import { createServerSupabase } from '@/lib/db/supabase/server';

export async function createInsight(userId: string, quote: string) {
  const supabase = await createServerSupabase();

  // Create embedding for the quote
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: quote,
    dimensions: 1536,
  });
  const embedding = data[0].embedding;

  const { data: insight } = await supabase
    .from('insight')
    .insert({ user_id: userId, quote, embedding: JSON.stringify(embedding) })
    .select()
    .single()
    .throwOnError();

  return insight!;
}
