import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TelegramProvider, ThemeProvider } from './context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TelegramProvider>
  </StrictMode>,
)
