import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTelegram } from './TelegramContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'calendar-countdown-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isTelegram, isDark: telegramIsDark, isReady: telegramReady } = useTelegram();
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first (for non-Telegram environment)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sync with Telegram theme when in Telegram environment
  useEffect(() => {
    if (isTelegram && telegramReady) {
      setThemeState(telegramIsDark ? 'dark' : 'light');
    }
  }, [isTelegram, telegramIsDark, telegramReady]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Only save to localStorage if not in Telegram
    if (!isTelegram) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, isTelegram]);

  // Listen to system preference changes (only when not in Telegram)
  useEffect(() => {
    if (isTelegram) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(THEME_KEY);
      // Only follow system preference if user hasn't explicitly set a theme
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isTelegram]);

  const toggleTheme = () => {
    // In Telegram, theme is controlled by Telegram app
    if (isTelegram) return;
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    // In Telegram, theme is controlled by Telegram app
    if (isTelegram) return;
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
