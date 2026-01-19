import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

// Telegram WebApp types
interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramInitData {
  user?: TelegramUser;
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  hash?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  version: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  initData: string;
  initDataUnsafe: TelegramInitData;
  BackButton?: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton?: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  safeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
}

// Helper to check if version is at least the required version
function isVersionAtLeast(version: string, required: string): boolean {
  const vParts = version.split('.').map(Number);
  const rParts = required.split('.').map(Number);
  
  for (let i = 0; i < Math.max(vParts.length, rParts.length); i++) {
    const v = vParts[i] || 0;
    const r = rParts[i] || 0;
    if (v > r) return true;
    if (v < r) return false;
  }
  return true;
}

interface TelegramContextType {
  isReady: boolean;
  isTelegram: boolean;
  themeParams: TelegramThemeParams | null;
  isDark: boolean;
  user: TelegramUser | null;
  initData: string;
  showBackButton: () => void;
  hideBackButton: () => void;
  onBackButtonClick: (callback: () => void) => () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp as TelegramWebApp;
  }
  return null;
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp] = useState<TelegramWebApp | null>(() => getTelegramWebApp());
  const isTelegram = webApp !== null;
  const [isReady, setIsReady] = useState(true); // Always ready - don't block rendering
  const [isDark, setIsDark] = useState(() => webApp?.colorScheme === 'dark');
  const [themeParams, setThemeParams] = useState<TelegramThemeParams | null>(() => webApp?.themeParams ?? null);
  const [safeAreaInsets] = useState(() => webApp?.safeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 });
  const [contentSafeAreaInsets] = useState(() => webApp?.contentSafeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 });
  const [user] = useState<TelegramUser | null>(() => webApp?.initDataUnsafe?.user ?? null);
  const [initData] = useState(() => webApp?.initData ?? '');

  useEffect(() => {
    if (!webApp) {
      console.log('[TelegramContext] Not in Telegram environment');
      return;
    }

    console.log('[TelegramContext] Initializing Telegram WebApp, version:', webApp.version);

    try {
      // Expand to full height
      webApp.expand();
      console.log('[TelegramContext] Expanded viewport');
      
      // Signal that the app is ready
      webApp.ready();
      console.log('[TelegramContext] Signaled ready to Telegram');
      
      // Log feature availability
      console.log('[TelegramContext] BackButton available:', isVersionAtLeast(webApp.version, '6.1'));
      console.log('[TelegramContext] MainButton available:', !!webApp.MainButton);
      
      setIsReady(true);
    } catch (error) {
      console.error('[TelegramContext] Failed to initialize:', error);
    }

    // Listen for theme changes
    const handleThemeChange = () => {
      console.log('[TelegramContext] Theme changed:', webApp.colorScheme);
      setIsDark(webApp.colorScheme === 'dark');
      setThemeParams(webApp.themeParams);
    };

    webApp.onEvent('themeChanged', handleThemeChange);

    return () => {
      webApp.offEvent('themeChanged', handleThemeChange);
    };
  }, [webApp]);

  const showBackButton = useCallback(() => {
    // BackButton requires version 6.1+
    if (!webApp || !isVersionAtLeast(webApp.version, '6.1') || !webApp.BackButton) return;
    webApp.BackButton.show();
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    // BackButton requires version 6.1+
    if (!webApp || !isVersionAtLeast(webApp.version, '6.1') || !webApp.BackButton) return;
    webApp.BackButton.hide();
  }, [webApp]);

  const onBackButtonClick = useCallback((callback: () => void) => {
    // BackButton requires version 6.1+
    if (!webApp || !isVersionAtLeast(webApp.version, '6.1') || !webApp.BackButton) return () => {};
    
    webApp.BackButton.onClick(callback);
    return () => {
      webApp.BackButton?.offClick(callback);
    };
  }, [webApp]);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    // MainButton available since 6.0 but with limited features
    if (!webApp || !webApp.MainButton) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (!webApp?.MainButton) return;
    webApp.MainButton.hide();
  }, [webApp]);

  return (
    <TelegramContext.Provider
      value={{
        isReady,
        isTelegram,
        themeParams,
        isDark,
        user,
        initData,
        showBackButton,
        hideBackButton,
        onBackButtonClick,
        showMainButton,
        hideMainButton,
        safeAreaInsets,
        contentSafeAreaInsets,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}

// Type augmentation for window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
