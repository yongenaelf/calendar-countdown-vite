# Holiday Countdown Frontend

React frontend for the Holiday Countdown Telegram Mini App.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Update `VITE_API_URL` to point to your backend:

```
VITE_API_URL=http://localhost:3000
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

The built files will be in the `dist/` directory, ready for static hosting.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | (empty - same origin) |
