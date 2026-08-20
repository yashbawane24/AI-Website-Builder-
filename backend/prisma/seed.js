// ============================================
// Database Seed — Templates
// ============================================

const prisma = require('../src/config/database');

const templates = [
  { name: 'Portfolio', category: 'portfolio', description: 'Clean modern portfolio for developers and designers', prompt: 'Create a modern, minimal portfolio website for a software developer. Include hero section with animated text, about section, skills with progress bars, projects gallery with hover effects, testimonials, and contact form. Use a dark theme with purple accent colors.' },
  { name: 'Business', category: 'business', description: 'Professional corporate business website', prompt: 'Create a professional business website for a consulting firm. Include hero with CTA, about us, services grid, team members, client logos, testimonials carousel, and contact section. Use a clean blue and white color scheme.' },
  { name: 'Restaurant', category: 'restaurant', description: 'Elegant restaurant with menu and reservations', prompt: 'Create an elegant restaurant website. Include hero with food imagery background, about section, menu with categories (starters, mains, desserts) and prices, chef section, gallery, testimonials, reservation form, location map, and footer. Use warm gold and dark tones.' },
  { name: 'Agency', category: 'agency', description: 'Creative digital agency landing page', prompt: 'Create a creative digital agency website. Include animated hero, services (web design, branding, marketing, SEO), portfolio gallery, process steps, team, client logos, testimonials, pricing plans, and contact. Use vibrant gradients and modern animations.' },
  { name: 'Healthcare', category: 'healthcare', description: 'Medical practice or clinic website', prompt: 'Create a healthcare clinic website. Include hero, about the clinic, medical services, doctors team with specializations, appointment booking form, patient testimonials, FAQ, insurance information, and contact details. Use clean blue and green tones.' },
  { name: 'Education', category: 'education', description: 'School, university, or online course platform', prompt: 'Create an educational institution website. Include hero, about, courses/programs listing, faculty members, campus gallery, student testimonials, upcoming events, admission process, and contact. Use professional blue tones.' },
  { name: 'Gym & Fitness', category: 'fitness', description: 'Gym membership and fitness center', prompt: 'Create a fitness gym website. Include dynamic hero with video background, about, classes schedule, trainer profiles, membership plans with pricing, gallery, success stories, BMI calculator, and contact form. Use bold dark theme with red/orange accents.' },
  { name: 'Real Estate', category: 'realestate', description: 'Property listings and real estate agency', prompt: 'Create a real estate agency website. Include hero with property search, featured listings grid, property categories, about the agency, agent profiles, testimonials, neighborhood guides, and contact form. Use elegant dark blue and gold tones.' },
  { name: 'E-commerce', category: 'ecommerce', description: 'Online store with product showcase', prompt: 'Create an e-commerce landing page. Include hero with featured product, product categories, trending products grid with prices, flash sale countdown, customer reviews, newsletter signup, and footer with payment icons. Use modern minimal design.' },
  { name: 'Travel', category: 'travel', description: 'Travel agency or tourism website', prompt: 'Create a travel agency website. Include hero with scenic background and search form, popular destinations grid, travel packages with pricing, why choose us, customer reviews, travel blog preview, newsletter, and contact. Use vibrant tropical colors.' },
  { name: 'Photography', category: 'photography', description: 'Photographer portfolio and booking', prompt: 'Create a photography portfolio website. Include fullscreen hero, masonry photo gallery, about the photographer, services and packages, client testimonials, booking form, and social media links. Use minimal dark theme to let photos stand out.' },
  { name: 'Finance', category: 'finance', description: 'Financial services or fintech company', prompt: 'Create a financial services website. Include hero with stats, services (investment, insurance, tax planning), about, team, client success stories, FAQ, security badges, and contact. Use professional navy blue and green palette.' },
  { name: 'SaaS Landing Page', category: 'saas', description: 'Software as a Service product landing page', prompt: 'Create a SaaS product landing page. Include hero with product screenshot and CTA, feature highlights with icons, how it works steps, pricing table (Free/Pro/Enterprise), integrations logos, testimonials, FAQ accordion, and CTA footer. Use modern gradient purple theme.' },
  { name: 'Blog', category: 'blog', description: 'Personal or professional blog layout', prompt: 'Create a blog website. Include hero with featured post, latest articles grid with thumbnails and excerpts, categories sidebar, popular posts, author bio, newsletter signup, and footer. Use clean readable typography with a minimal light theme.' },
  { name: 'Resume', category: 'resume', description: 'Online resume and CV website', prompt: 'Create a personal resume website. Include hero with name and title, about me, work experience timeline, education, skills bars, certifications, portfolio/projects, downloadable CV button, and contact form. Use elegant dark theme with accent color.' },
];

async function main() {
  console.log('🌱 Seeding templates...');

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.name.toLowerCase().replace(/\s+/g, '-') },
      update: t,
      create: { id: t.name.toLowerCase().replace(/\s+/g, '-'), ...t },
    });
    console.log(`  ✅ ${t.name}`);
  }

  console.log('\n👤 Seeding users...');
  const bcrypt = require('bcryptjs');
  
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const userPassword = await bcrypt.hash('User@1234', 12);

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@aiwebbuilder.com' },
    update: {},
    create: {
      email: 'admin@aiwebbuilder.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      credits: 9999,
      emailVerified: true,
    },
  });
  console.log('  ✅ Admin User (admin@aiwebbuilder.com / Admin@1234)');

  // Sample User
  await prisma.user.upsert({
    where: { email: 'user@aiwebbuilder.com' },
    update: {},
    create: {
      email: 'user@aiwebbuilder.com',
      password: userPassword,
      name: 'Sample User',
      role: 'USER',
      credits: 100,
      emailVerified: true,
    },
  });
  console.log('  ✅ Sample User (user@aiwebbuilder.com / User@1234)');

  console.log('\n✨ Seeding complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
