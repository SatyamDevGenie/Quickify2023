/**
 * GROQ API service – fast LLM inference for CartBuddy AI features.
 * Uses OpenAI-compatible chat completions: https://api.groq.com/openai/v1/chat/completions
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

/**
 * Call GROQ chat completions API.
 * @param {Array<{ role: 'system'|'user'|'assistant', content: string }>} messages
 * @param {string} [model] - Optional model override
 * @returns {Promise<string>} Assistant reply text
 */
export async function getCompletion(messages, model = DEFAULT_MODEL) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment');
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GROQ API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (content == null) throw new Error('GROQ API returned no content');
  return content;
}
