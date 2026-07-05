import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import insightRoutes from './routes/insight.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.use('/api/insights', insightRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
