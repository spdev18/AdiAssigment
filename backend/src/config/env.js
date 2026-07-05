import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blackcoffer_insights',
  allowMemoryFallback: process.env.ALLOW_MEMORY_FALLBACK !== 'false',
  autoSeed: process.env.AUTO_SEED !== 'false',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default env;
