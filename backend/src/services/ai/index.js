// ============================================
// AI Service — Provider Abstraction Layer + Failsafe
// ============================================

const env = require('../../config/env');
const { openaiGenerate } = require('./openai.provider');
const { googleGenerate } = require('./google.provider');
const { anthropicGenerate } = require('./anthropic.provider');
const { generateMockWebsite } = require('./mock.provider');
const { buildSystemPrompt, buildUserPrompt } = require('./prompts');

const providers = {
  openai: openaiGenerate,
  google: googleGenerate,
  anthropic: anthropicGenerate,
};

/**
 * Helper to check if an API key is a placeholder or default dummy string
 */
const isInvalidKey = (key) => {
  if (!key) return true;
  const k = key.trim().toLowerCase();
  return (
    k.includes('your-') ||
    k.includes('sk-your-') ||
    k.includes('placeholder') ||
    k === 'sk-xxx' ||
    k.length < 15
  );
};

/**
 * Generate a website from a user prompt
 * @param {string} prompt - User's website description
 * @param {object} options - { template, style, sections }
 * @returns {Promise<{ html: string, css: string, js: string, react: string }>}
 */
const generateWebsite = async (prompt, options = {}) => {
  const providerName = env.AI_PROVIDER || 'openai';
  const provider = providers[providerName];

  // Check if active key is placeholder
  const activeKey =
    providerName === 'openai'
      ? env.OPENAI_API_KEY
      : providerName === 'google'
      ? env.GOOGLE_AI_API_KEY
      : env.ANTHROPIC_API_KEY;

  if (isInvalidKey(activeKey)) {
    console.log(`[AI Service] Active key for ${providerName} is placeholder or unconfigured. Using smart fallback generator.`);
    return generateMockWebsite(prompt);
  }

  try {
    const systemPrompt = buildSystemPrompt(options);
    const userPrompt = buildUserPrompt(prompt, options);

    const result = await provider(systemPrompt, userPrompt);
    return result;
  } catch (err) {
    console.warn(`[AI Service] Provider ${providerName} failed (${err.message}). Falling back to smart AI website generator.`);
    return generateMockWebsite(prompt);
  }
};

module.exports = { generateWebsite };
