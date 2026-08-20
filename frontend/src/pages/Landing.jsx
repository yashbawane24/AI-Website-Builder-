// ============================================
// Landing Page — Premium SaaS Landing
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Wand2, Code, Eye, Zap, Shield, Globe, Download,
  Star, Check, ChevronDown, ChevronUp, Monitor, Smartphone, Layers,
  Palette, Lock, Cpu, Users, CreditCard, LayoutTemplate, MessageSquare,
} from 'lucide-react';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

// ===== NAVBAR =====
const Navbar = () => (
  <nav className="landing-nav">
    <div className="nav-inner">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))',
        }}>
          <Sparkles size={16} color="white" />
        </div>
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.125rem' }}>AI Builder</span>
      </Link>


      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
      </div>
    </div>
  </nav>
);

// ===== HERO =====
const Hero = () => (
  <section className="landing-hero">
    <div className="bg-mesh" />

    {/* Subtle grid overlay */}
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
    }} />

    <div className="hero-inner">
      <motion.div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 9999, marginBottom: 32,
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles size={14} style={{ color: 'var(--color-primary-400)' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary-400)' }}>
          Powered by GPT-4.1 &amp; Gemini
        </span>
      </motion.div>

      <motion.h1
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: 'var(--color-text-primary)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Build Websites with
        <br />
        <span className="gradient-text">AI in Seconds</span>
      </motion.h1>

      <motion.p
        style={{ fontSize: '1.125rem', maxWidth: 560, margin: '0 auto 40px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Type a prompt. Get a complete, responsive website. Edit with a live code editor.
        Download and deploy — all in minutes.
      </motion.p>

      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Building Free <ArrowRight size={18} />
        </Link>
        <Link to="/login" className="btn btn-secondary btn-lg">
          Sign In
        </Link>
      </motion.div>

      {/* Prompt Demo */}
      <motion.div
        className="prompt-demo"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="dots">
          <div className="dot" style={{ background: '#ef4444' }} />
          <div className="dot" style={{ background: '#f59e0b' }} />
          <div className="dot" style={{ background: '#22c55e' }} />
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--color-text-dim)' }}>AI Website Builder</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Wand2 size={18} style={{ color: 'var(--color-primary-400)', flexShrink: 0 }} />
          <p style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
            &quot;Create a modern startup landing page with pricing and testimonials&quot;
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ===== FEATURES =====
const features = [
  { icon: Wand2, title: 'AI Generation', desc: 'Describe your website in plain English. Our AI generates complete, production-ready code.' },
  { icon: Eye, title: 'Live Preview', desc: 'See your website instantly with desktop, tablet, and mobile responsive previews.' },
  { icon: Code, title: 'Code Editor', desc: 'Built-in Monaco Editor. Edit HTML, CSS, JavaScript, and React code with syntax highlighting.' },
  { icon: LayoutTemplate, title: '15+ Templates', desc: 'Start from professionally designed templates for any industry — portfolios, SaaS, restaurants.' },
  { icon: Download, title: 'Export & Deploy', desc: 'Download as HTML or React project. Deploy anywhere — Vercel, Netlify, or your own server.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'JWT auth, rate limiting, input validation, bcrypt hashing, and SQL injection protection.' },
  { icon: Cpu, title: 'Multi-AI Support', desc: 'Switch between GPT-4.1, Gemini, and Claude with a single environment variable.' },
  { icon: Layers, title: 'Version History', desc: 'Track every change. Restore previous versions instantly. Never lose your work.' },
];

const Features = () => (
  <section className="section" id="features">
    <div className="section-inner">
      <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2>Everything You Need to <span className="gradient-text">Build Faster</span></h2>
        <p>A complete platform for AI-powered web development with all the tools you need.</p>
      </motion.div>

      <div className="feature-grid">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              className="feature-card"
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <Icon size={20} style={{ color: 'var(--color-primary-400)' }} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ===== HOW IT WORKS =====
const steps = [
  { num: '01', title: 'Describe Your Website', desc: 'Type a natural language prompt describing the website you want to create.' },
  { num: '02', title: 'AI Generates Code', desc: 'Our AI creates a complete website with HTML, CSS, JavaScript, and React components.' },
  { num: '03', title: 'Preview & Edit', desc: 'Review the live preview, make edits in the code editor, and save your project.' },
  { num: '04', title: 'Download & Deploy', desc: 'Export as a ZIP file and deploy to any hosting platform in minutes.' },
];

const HowItWorks = () => (
  <section className="section-alt">
    <div className="section-inner">
      <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2>How It <span className="gradient-text">Works</span></h2>
        <p>Four simple steps to your perfect website.</p>
      </motion.div>

      <div className="steps-grid">
        {steps.map((s, i) => (
          <motion.div key={i} className="step-card" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="step-num gradient-text">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ===== PRICING =====
const plans = [
  { name: 'Free', price: '$0', interval: 'forever', features: ['20 Free Credits', 'Basic Templates', 'HTML Export', 'Community Support'], cta: 'Get Started Free', popular: false },
  { name: 'Pro', price: '$19.99', interval: '/month', features: ['500 Credits/month', 'All Templates', 'React Export', 'Priority Support', 'Version History', 'Custom Domains'], cta: 'Start Pro Trial', popular: true },
  { name: 'Enterprise', price: '$49.99', interval: '/month', features: ['2000 Credits/month', 'Everything in Pro', 'Team Collaboration', 'API Access', 'Dedicated Support', 'White Label', 'Analytics'], cta: 'Contact Sales', popular: false },
];

const Pricing = () => (
  <section className="section" id="pricing">
    <div className="section-inner">
      <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2>Simple, Transparent <span className="gradient-text">Pricing</span></h2>
        <p>Start free. Upgrade when you need more.</p>
      </motion.div>

      <div className="pricing-grid">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            className={`pricing-card ${p.popular ? 'popular' : ''}`}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {p.popular && <span className="popular-badge">Most Popular</span>}

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{p.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
              <span className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 700 }}>{p.price}</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{p.interval}</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {p.features.map((f, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>

            <Link to="/register" className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ===== TESTIMONIALS =====
const testimonials = [
  { name: 'Sarah Chen', role: 'Startup Founder', text: 'Built our entire landing page in 5 minutes. The AI understood exactly what I wanted. Incredible quality.', rating: 5 },
  { name: 'Marcus Rodriguez', role: 'Freelance Developer', text: 'I use AI Builder for rapid prototyping. Clients are amazed at how fast I deliver. Absolute game changer.', rating: 5 },
  { name: 'Emily Watson', role: 'Marketing Director', text: 'We replaced our expensive design agency. The templates are gorgeous and the AI customization is perfect.', rating: 5 },
];

const Testimonials = () => (
  <section className="section-alt">
    <div className="section-inner">
      <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2>Loved by <span className="gradient-text">Thousands</span></h2>
        <p>See what our users are saying.</p>
      </motion.div>

      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <motion.div key={i} className="testimonial-card" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={16} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
              &quot;{t.text}&quot;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-500))', color: 'white',
              }}>
                {t.name[0]}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{t.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ===== FAQ =====
const faqs = [
  { q: 'How does the AI website generation work?', a: 'Simply describe the website you want in natural language. Our AI (powered by GPT-4.1, Gemini, or Claude) generates complete HTML, CSS, JavaScript, and React code in seconds.' },
  { q: 'Can I edit the generated code?', a: 'Yes! We include a full Monaco code editor (the same one used in VS Code) where you can edit HTML, CSS, JavaScript, and React code with syntax highlighting and auto-save.' },
  { q: 'What do I get with the free plan?', a: 'Free users get 20 credits to start. Each website generation costs 2 credits. You can preview, edit, download, and deploy any website you generate.' },
  { q: 'Can I export my websites?', a: 'Absolutely. Download your website as a ZIP file containing HTML/CSS/JS or as a complete React project. Deploy it anywhere — Vercel, Netlify, or your own server.' },
  { q: 'Is my data secure?', a: 'Yes. We use JWT authentication, bcrypt password hashing, rate limiting, input validation, Helmet.js for HTTP security headers, and all data is encrypted at rest.' },
  { q: 'Can I switch AI providers?', a: 'Yes. We support OpenAI (GPT-4.1), Google Gemini, and Anthropic Claude. You can switch between providers with a single configuration change.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="section" id="faq">
      <div className="section-inner-sm">
        <motion.div className="section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="faq-item" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  : <ChevronDown size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                }
              </button>
              {open === i && (
                <motion.div className="faq-answer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===== CTA =====
const CTA = () => (
  <section className="section-alt">
    <motion.div className="cta-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Sparkles size={32} style={{ color: 'var(--color-primary-400)', marginBottom: 16 }} />
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16 }}>
        Ready to Build Your Website?
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
        Join thousands of creators building stunning websites with AI. Start free today.
      </p>
      <Link to="/register" className="btn btn-primary btn-lg">
        Get Started Free <ArrowRight size={18} />
      </Link>
    </motion.div>
  </section>
);

// ===== FOOTER =====
const Footer = () => (
  <footer className="landing-footer">
    <div className="footer-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span className="gradient-text" style={{ fontWeight: 700 }}>AI Builder</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', maxWidth: 240 }}>
          Build stunning websites with AI in seconds.
        </p>
      </div>

      <div>
        <h4>Product</h4>
        <ul>
          {['Features', 'Templates', 'Pricing', 'Changelog'].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Company</h4>
        <ul>
          {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Legal</h4>
        <ul>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
      </div>
    </div>

    <div style={{ maxWidth: 1200, margin: '48px auto 0', paddingTop: 32, borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: 13, color: 'var(--color-text-dim)' }}>
      © {new Date().getFullYear()} AI Website Builder. All rights reserved.
    </div>
  </footer>
);

// ===== MAIN PAGE =====
const Landing = () => (
  <div>
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <Pricing />
    <Testimonials />
    <FAQ />
    <CTA />
    <Footer />
  </div>
);

export default Landing;
