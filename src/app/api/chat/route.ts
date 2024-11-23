import { openai } from '@ai-sdk/openai';
import { jsonSchema, streamText, tool } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `VERY IMPORTANT: If tool calls, please output in the format given below. The system will parse the XML tags below and render the UI.
    IMPORTANT: tools must be run once and only once.`,
    messages,
    tools: {
      quote_message: tool({
        description:
          'Quote a message from the context. Use to quote something someone else, another great person, said.',
        parameters: jsonSchema<{ quote: string; author: string }>({
          type: 'object',
          properties: {
            quote: {
              type: 'string',
              description: 'The message being quoted',
            },
            author: {
              type: 'string',
              description: 'The author of the quoted message',
            },
          },
          required: ['quote', 'author'],
        }),
        execute: async ({ quote, author }) => {
          return `VERY IMPORTANT: Please output in the format given below. The system will parse the XML tags below and render the UI.
Very important: Before writing the quote_message_result tag, write YOUR_MESSAGE (just enough to say who wrote it) and then write the XML tag on the next line.

\`\`\`
{{YOUR_MESSAGE}}
<quote_message_result><quote>${quote}</quote><author>${author}</author></quote_message_result>
\`\`\`
`;
        },
      }),
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
