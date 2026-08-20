// ============================================
// Smart Fallback Website Generator
// Generates production-grade HTML/CSS/JS when AI key is missing or invalid
// ============================================

const generateMockWebsite = (prompt = '') => {
  const p = prompt.toLowerCase();
  
  let title = 'Modern Web Application';
  let tagline = 'Created with AI Website Builder';

  if (p.includes('portfolio') || p.includes('engineer') || p.includes('developer')) {
    title = 'Alex Rivera — Senior Software Engineer';
    tagline = 'Building scalable web applications, distributed systems, and modern AI experiences.';
  } else if (p.includes('restaurant') || p.includes('food') || p.includes('cafe') || p.includes('menu')) {
    title = 'Aura — Artisan Kitchen & Bar';
    tagline = 'Farm-to-table culinary craftsmanship with a contemporary twist.';
  } else if (p.includes('saas') || p.includes('startup') || p.includes('landing') || p.includes('product')) {
    title = 'PulseAI — Next-Gen Workflow Automation';
    tagline = 'Automate complex software workflows with autonomous AI agents.';
  } else if (p.includes('photography') || p.includes('photo') || p.includes('gallery')) {
    title = 'Lumina Photography Studio';
    tagline = 'Capturing timeless moments through creative light and narrative visual storytelling.';
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="#" class="brand">${title.split('—')[0].trim()}</a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#showcase">Showcase</a>
        <a href="#contact" class="btn-primary">Get Started</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-container">
      <span class="badge">🚀 Powered by AI Generation</span>
      <h1>${title}</h1>
      <p class="subtitle">${tagline}</p>
      <div class="cta-group">
        <a href="#contact" class="btn-primary">Explore Project</a>
        <a href="#showcase" class="btn-secondary">View Live Demo</a>
      </div>
    </div>
  </header>

  <section id="features" class="section">
    <div class="container">
      <div class="section-title">
        <h2>Designed for Performance & Elegance</h2>
        <p>Built using modern semantic HTML, ultra-responsive CSS, and vanilla JS interactions.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="icon">⚡</div>
          <h3>Ultra Fast Performance</h3>
          <p>Optimized asset loading with sub-second rendering times across desktop and mobile browsers.</p>
        </div>

        <div class="card">
          <div class="icon">🎨</div>
          <h3>Modern Aesthetic</h3>
          <p>Crafted with rich dark-mode visuals, vibrant gradients, and glassmorphic elevated surfaces.</p>
        </div>

        <div class="card">
          <div class="icon">🔒</div>
          <h3>Production Ready</h3>
          <p>Fully compliant with web standards, SEO best practices, and accessible keyboard navigation.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="showcase" class="section section-alt">
    <div class="container">
      <div class="section-title">
        <h2>Interactive Showcase</h2>
        <p>See how seamlessly component structures adapt to user input in real-time.</p>
      </div>

      <div class="demo-box">
        <div class="demo-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="demo-title">preview.html</span>
        </div>
        <div class="demo-body">
          <p>✨ <strong>User Prompt:</strong> "${prompt || 'Modern website'}"</p>
          <div class="counter-widget">
            <p>Interactive Counter Widget Demo:</p>
            <div class="counter-controls">
              <button id="decrement-btn" class="counter-btn">-</button>
              <span id="counter-value" class="counter-num">0</span>
              <button id="increment-btn" class="counter-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="section">
    <div class="container">
      <div class="card contact-card">
        <h2>Ready to launch your project?</h2>
        <p>Get in touch or generate your custom deployment seamlessly.</p>
        <form id="contact-form" class="form-grid">
          <input type="text" placeholder="Your Name" required class="form-input">
          <input type="email" placeholder="Your Email" required class="form-input">
          <textarea placeholder="Tell us about your project requirements..." rows="4" required class="form-input full-width"></textarea>
          <button type="submit" class="btn-primary full-width">Send Message</button>
        </form>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${title.split('—')[0].trim()}. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `:root {
  --bg-main: #0B1020;
  --bg-surface: #111827;
  --bg-card: #1F2937;
  --primary: #8b5cf6;
  --primary-hover: #7c3aed;
  --accent: #22d3ee;
  --text-main: #F9FAFB;
  --text-muted: #9CA3AF;
  --border: #374151;
  --font: 'Inter', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: var(--font);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 16, 32, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  text-decoration: none;
  background: linear-gradient(135deg, #a78bfa, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--text-main);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border);
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--border);
}

.hero {
  padding: 120px 24px 80px;
  text-align: center;
  background: radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
}

.hero h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.section {
  padding: 90px 0;
}

.section-alt {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-title {
  text-align: center;
  margin-bottom: 56px;
}

.section-title h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.section-title p {
  color: var(--text-muted);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .grid-3 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.25rem; }
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.2s;
}

.card:hover {
  border-color: #4B5563;
  transform: translateY(-2px);
}

.icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.card p {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.demo-box {
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.demo-header {
  background: #111827;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.red { background: #ef4444; }
.yellow { background: #f59e0b; }
.green { background: #22c55e; }

.demo-title {
  font-family: monospace;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-left: 8px;
}

.demo-body {
  padding: 32px;
}

.counter-widget {
  margin-top: 24px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.counter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.counter-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  border: none;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
}

.counter-num {
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.contact-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-main);
  font-size: 0.9375rem;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary);
}

.full-width {
  width: 100%;
}

.footer {
  padding: 40px 0;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}`;

  const js = `document.addEventListener('DOMContentLoaded', () => {
  // Counter Widget Logic
  let count = 0;
  const countVal = document.getElementById('counter-value');
  const incBtn = document.getElementById('increment-btn');
  const decBtn = document.getElementById('decrement-btn');

  if (incBtn && decBtn && countVal) {
    incBtn.addEventListener('click', () => {
      count++;
      countVal.textContent = count;
    });

    decBtn.addEventListener('click', () => {
      count--;
      countVal.textContent = count;
    });
  }

  // Contact Form Logic
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent successfully.');
      contactForm.reset();
    });
  }
});`;

  return { html, css, js, react: '' };
};

module.exports = { generateMockWebsite };
