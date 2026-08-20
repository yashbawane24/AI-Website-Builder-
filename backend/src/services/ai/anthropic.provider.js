// ============================================
// Anthropic Claude Provider
// ============================================

const env = require('../../config/env');

const anthropicGenerate = async (systemPrompt, userPrompt) => {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic error: ${err}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  if (!content) throw new Error('No response from Anthropic');

  // Try to extract JSON from the response
  let jsonStr = content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) jsonStr = jsonMatch[0];

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      html: parsed.html || '',
      css: parsed.css || '',
      js: parsed.js || '',
      react: parsed.react || '',
    };
  } catch {
    throw new Error('Failed to parse Anthropic response as JSON');
  }
};

module.exports = { anthropicGenerate };
