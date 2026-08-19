// ============================================
// Express Server — Entry Point
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// --- Security Middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Stripe webhook needs raw body (MUST come before express.json) ---
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// --- Body Parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Rate Limiting ---
app.use('/api/', generalLimiter);

// --- Static Files ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI Website Builder API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// --- API Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/generate', require('./routes/generate.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// --- 404 Handler ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start Server ---
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`\n🚀 AI Website Builder API`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   URL:         http://localhost:${PORT}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
