// ============================================
// Google Gemini Provider
// ============================================

const env = require('../../config/env');

const googleGenerate = async (systemPrompt, userPrompt) => {
  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not configured');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GOOGLE_AI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 16000,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google AI error: ${err}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('No response from Google AI');

  try {
    const parsed = JSON.parse(content);
    return {
      html: parsed.html || '',
      css: parsed.css || '',
      js: parsed.js || '',
      react: parsed.react || '',
    };
  } catch {
    throw new Error('Failed to parse Google AI response as JSON');
  }
};

module.exports = { googleGenerate };
