import app from './app.js';
import env from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { seedDatabase } from './utils/seedDatabase.js';

async function start() {
  try {
    await connectDatabase();

    if (env.autoSeed) {
      const { seeded, count } = await seedDatabase({ onlyIfEmpty: true });
      if (!seeded) console.log(`[seed] Collection already has ${count} documents — skipping`);
    }

    const server = app.listen(env.port, () => {
      console.log(`[server] API running at http://localhost:${env.port} (${env.nodeEnv})`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[server] ${signal} received — shutting down`);
      server.close();
      await disconnectDatabase();
      process.exit(0);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[server] Failed to start:', error.message);
    process.exit(1);
  }
}

start();
