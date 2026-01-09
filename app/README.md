# Holiday Countdown App

A beautiful mobile-first holiday countdown app built with React, TypeScript, Vite, and Tailwind CSS v4.

## Features

- 🎉 **Welcome Screen** - Beautiful onboarding with feature highlights
- 📅 **Holiday List** - View all your upcoming holidays with live countdowns
- 🔍 **Holiday Detail** - Detailed view with countdown timer and holiday info
- ➕ **Add Holiday** - Create custom holidays with emoji icons
- 📥 **Import Holidays** - Sync calendars or upload ICS/CSV files
- 🌍 **Browse Holidays** - Quick add holidays by country or religion
- 🎨 **Widget Configuration** - Customize home screen widgets

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **React Router v7** - Client-side routing

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

Push to the `main` branch and GitHub Actions will automatically build and deploy to:

**https://yongenaelf.github.io/calendar-countdown-vite/**

### Manual Setup

1. Go to your repo **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` branch to trigger deployment

### Configuration

- Base path is set to `/calendar-countdown-vite/` in `vite.config.ts`
- 404.html is auto-generated for client-side routing support

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── HolidayCard.tsx
│   ├── IconButton.tsx
│   └── MobileContainer.tsx
├── hooks/            # Custom React hooks
│   └── useCountdown.ts
├── screens/          # Page components
│   ├── WelcomeScreen.tsx
│   ├── HolidayListScreen.tsx
│   ├── HolidayDetailScreen.tsx
│   ├── AddHolidayScreen.tsx
│   ├── ImportHolidaysScreen.tsx
│   ├── BrowseHolidaysScreen.tsx
│   └── WidgetConfigScreen.tsx
├── types/            # TypeScript types
│   └── holiday.ts
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles & Tailwind config
```

## Design System

### Colors

- **Joy colors**: Yellow (#FCD34D), Orange (#FB923C), Pink (#F472B6)
- **Relax colors**: Blue (#E0F2FE), Green (#DCFCE7), Teal (#CCFBF1)
- **Primary**: Sky blue (#0EA5E9)
- **Secondary**: Rose (#F43F5E)

### Typography

- Font: Inter (400-900 weights)
- Icons: Material Symbols Outlined

## Routes

| Path | Screen |
|------|--------|
| `/` | Welcome Screen |
| `/holidays` | Holiday List |
| `/holiday/:id` | Holiday Detail |
| `/add` | Add New Holiday |
| `/import` | Import Holidays |
| `/browse` | Browse Holidays by Country/Religion |
| `/widget` | Widget Configuration |
