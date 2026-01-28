import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use root path for Telegram Mini App deployment
  // Change to specific path if deploying to a subdirectory
  base: '/',
})
