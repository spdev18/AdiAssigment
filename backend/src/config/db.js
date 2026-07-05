import mongoose from 'mongoose';
import env from './env.js';

let memoryServer = null;

/**
 * Connects to MongoDB. Tries MONGO_URI first; in development it can fall
 * back to an in-memory MongoDB instance (mongodb-memory-server) so the
 * project runs on machines without a local MongoDB installation. The rest
 * of the application is unaware of which instance it is talking to.
 */
export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`[db] Connected to MongoDB at ${env.mongoUri}`);
    return { uri: env.mongoUri, inMemory: false };
  } catch (error) {
    if (!env.allowMemoryFallback || env.nodeEnv === 'production') {
      throw error;
    }
    console.warn(`[db] Could not reach ${env.mongoUri} (${error.message})`);
    console.warn('[db] Falling back to in-memory MongoDB (development only)...');

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'blackcoffer_insights' },
    });
    const uri = memoryServer.getUri('blackcoffer_insights');
    await mongoose.connect(uri);
    console.log(`[db] Connected to in-memory MongoDB at ${uri}`);
    return { uri, inMemory: true };
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
