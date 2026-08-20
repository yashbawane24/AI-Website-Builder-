// ============================================
// OpenAI Provider
// ============================================

const OpenAI = require('openai');
const env = require('../../config/env');

let client;
const getClient = () => {
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
};

const openaiGenerate = async (systemPrompt, userPrompt) => {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 16000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  try {
    const parsed = JSON.parse(content);
    return {
      html: parsed.html || '',
      css: parsed.css || '',
      js: parsed.js || '',
      react: parsed.react || '',
    };
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
};

module.exports = { openaiGenerate };
