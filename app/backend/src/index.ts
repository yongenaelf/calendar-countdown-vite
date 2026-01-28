import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import notificationsRouter from './routes/notifications.js';
import cronRouter from './routes/cron.js';

// Initialize Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Make redis available to routes
app.locals.redis = redis;

// Health check endpoint (required for Docker health check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/notifications', notificationsRouter);
app.use('/api/cron', cronRouter);

// Start server
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await redis.quit();
  process.exit(0);
});
