# Holiday Countdown Backend

Express.js backend for the Holiday Countdown Telegram Mini App.

## Features

- REST API for countdown notifications
- Redis for data storage (KV replacement)
- Telegram Bot API integration
- Docker support with health checks

## Setup

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start Redis (using Docker):

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update environment variables in `.env`:

```
PORT=3000
REDIS_URL=redis://localhost:6379
BOT_TOKEN=your_telegram_bot_token
```

5. Start development server:

```bash
npm run dev
```

### Docker Deployment

1. Create `.env` file with your `BOT_TOKEN`:

```bash
echo "BOT_TOKEN=your_telegram_bot_token" > .env
```

2. Build and run with Docker Compose:

```bash
docker-compose up -d
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### Notifications

```
POST /api/notifications
```

Register a new countdown notification.

**Body:**
```json
{
  "userId": 123456789,
  "holidayId": "christmas-2026",
  "name": "Christmas",
  "date": "2026-12-25T00:00:00.000Z",
  "icon": "forest",
  "reminderOption": "1_week",
  "initData": "..."
}
```

```
DELETE /api/notifications?userId=123&holidayId=abc
```

Remove a specific countdown notification.

```
DELETE /api/notifications?userId=123&clearAll=true
```

Remove all countdown notifications for a user.

### Cron

```
GET /api/cron
```

Process scheduled notifications. Call this periodically (e.g., every hour) from an external scheduler.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `BOT_TOKEN` | Telegram Bot token | (required) |
| `CRON_SECRET` | Optional secret for cron endpoint | (none) |
