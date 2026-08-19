// ============================================
// Prisma Client — Singleton Pattern (SQLite)
// ============================================

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

function createClient() {
  const dbPath = 'file:' + path.resolve(__dirname, '../../prisma/dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error'],
  });
}

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = createClient();
} else {
  // In development, reuse the client across hot-reloads
  if (!global.__prisma) {
    global.__prisma = createClient();
  }
  prisma = global.__prisma;
}

module.exports = prisma;
