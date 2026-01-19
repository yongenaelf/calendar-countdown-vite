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
const THEME_OVERRIDE_KEY = 'calendar-countdown-theme-override';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isTelegram, isDark: telegramIsDark, isReady: telegramReady } = useTelegram();
  
  // Track if user has manually overridden the theme
  const [hasUserOverride, setHasUserOverride] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_OVERRIDE_KEY) === 'true';
    }
    return false;
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
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

  // Sync with Telegram theme when in Telegram environment (only if user hasn't overridden)
  useEffect(() => {
    if (isTelegram && telegramReady && !hasUserOverride) {
      setThemeState(telegramIsDark ? 'dark' : 'light');
    }
  }, [isTelegram, telegramIsDark, telegramReady, hasUserOverride]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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
    // Mark that user has manually overridden the theme
    if (isTelegram) {
      setHasUserOverride(true);
      localStorage.setItem(THEME_OVERRIDE_KEY, 'true');
    }
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    // Mark that user has manually overridden the theme
    if (isTelegram) {
      setHasUserOverride(true);
      localStorage.setItem(THEME_OVERRIDE_KEY, 'true');
    }
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
