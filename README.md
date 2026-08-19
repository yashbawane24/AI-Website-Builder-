# AI Website Builder

A full-stack SaaS application that uses AI to generate complete, responsive websites from natural language prompts.

## Features

- 🤖 **AI Website Generation** — Describe your website and get complete HTML/CSS/JS/React code
- ✏️ **Monaco Code Editor** — Edit generated code with VS Code-quality editor
- 👁️ **Live Preview** — Desktop, tablet, and mobile responsive previews
- 📦 **Export & Download** — Download as HTML or React project (ZIP)
- 🎨 **15+ Templates** — Portfolio, Business, Restaurant, SaaS, E-commerce, and more
- 💳 **Stripe Payments** — Credit purchases and subscription plans
- 🔐 **Authentication** — JWT-based auth with email verification and password reset
- 👑 **Admin Dashboard** — User management, revenue tracking, template CRUD
- 📱 **Fully Responsive** — Beautiful dark theme UI built with Tailwind CSS

## Tech Stack

### Frontend
- React 19 + Vite 8
- Tailwind CSS v4
- Framer Motion
- React Router v7
- Monaco Editor
- Recharts
- React Hook Form + Zod validation

### Backend
- Node.js + Express 5
- PostgreSQL + Prisma ORM
- JWT Authentication
- Stripe Payments
- Multi-AI Provider (OpenAI / Gemini / Claude)
- Nodemailer

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Neon/Supabase)
- Stripe account
- AI API key (OpenAI, Google, or Anthropic)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# AI Provider (openai | google | anthropic)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optional for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=app-password
```

### 3. Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Template seeding
│   └── src/
│       ├── config/            # Environment, database
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth, validation, rate limiting
│       ├── routes/            # Express routes
│       ├── services/          # Business logic
│       │   └── ai/            # AI provider abstraction
│       ├── utils/             # Helpers
│       └── index.js           # Entry point
│
├── frontend/
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── editor/        # Monaco code editor
│       │   ├── layout/        # Dashboard layout, sidebar, header
│       │   └── preview/       # Live preview iframe
│       ├── context/           # Auth context
│       ├── pages/             # All application pages
│       │   ├── admin/         # Admin panel pages
│       │   ├── auth/          # Login, register, etc.
│       │   ├── billing/       # Credits & subscription
│       │   ├── dashboard/     # Main dashboard
│       │   ├── generator/     # AI generation page
│       │   ├── profile/       # User profile
│       │   ├── projects/      # Project management
│       │   ├── settings/      # User settings
│       │   └── templates/     # Template gallery
│       └── services/          # API client
```

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend → Render
```bash
# Set environment variables in Render dashboard
# Start command: npm start
# Build command: npx prisma generate && npx prisma migrate deploy
```

### Database → Neon/Supabase
Use a managed PostgreSQL service and update `DATABASE_URL`.

## License

MIT
