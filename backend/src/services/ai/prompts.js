// ============================================
// AI Prompts — System & User Prompt Templates
// ============================================

const buildSystemPrompt = (options = {}) => {
  return `You are an expert web developer and designer. You create beautiful, modern, responsive websites.

RULES:
1. Generate COMPLETE, production-ready code — not snippets or placeholders.
2. The website MUST be fully responsive (mobile, tablet, desktop).
3. Use modern CSS (flexbox, grid, custom properties, smooth transitions).
4. Include semantic HTML5 elements.
5. Add smooth animations and hover effects.
6. Use a professional color palette with gradients.
7. Include proper meta tags and SEO structure.
8. All code must be clean, well-commented, and properly indented.

STYLE PREFERENCES:
- Modern, clean, premium design
- Dark or light theme based on the request
- Professional typography (use Google Fonts via CDN links)
- Smooth scroll behavior
- Glassmorphism or gradient effects where appropriate
${options.style ? `- Additional style: ${options.style}` : ''}

OUTPUT FORMAT:
You MUST respond with a JSON object containing exactly these four keys:
{
  "html": "<!DOCTYPE html>...",
  "css": "/* styles */...",
  "js": "// scripts...",
  "react": "// React component version..."
}

For the HTML: Include a complete standalone page with inline CSS link tag pointing to styles.css and script tag pointing to script.js.
For the CSS: Include all styles in a separate stylesheet.
For the JS: Include any interactivity (mobile menu, scroll animations, form handling, etc.).
For the React: Create a single-file React component version of the website that can be rendered standalone.

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no explanation text outside the JSON.`;
};

const buildUserPrompt = (prompt, options = {}) => {
  let enhancedPrompt = prompt;

  if (options.template) {
    enhancedPrompt += `\n\nBase this on a "${options.template}" template style.`;
  }

  if (options.sections && options.sections.length > 0) {
    enhancedPrompt += `\n\nInclude these sections: ${options.sections.join(', ')}.`;
  }

  return `Create a website based on this description:\n\n${enhancedPrompt}\n\nRemember to respond with ONLY a valid JSON object containing html, css, js, and react keys.`;
};

module.exports = { buildSystemPrompt, buildUserPrompt };
