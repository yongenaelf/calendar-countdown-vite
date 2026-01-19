import type { ReactNode, CSSProperties } from 'react';
import { useTelegram } from '../context';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  const { isTelegram, safeAreaInsets, contentSafeAreaInsets } = useTelegram();

  // Calculate padding based on Telegram safe areas
  // For Telegram, we combine safeAreaInsets (device notch/home indicator) 
  // and contentSafeAreaInsets (Telegram header/UI elements)
  const telegramPaddingTop = safeAreaInsets.top + contentSafeAreaInsets.top;
  const telegramPaddingBottom = safeAreaInsets.bottom + contentSafeAreaInsets.bottom;
  const telegramPaddingLeft = safeAreaInsets.left + contentSafeAreaInsets.left;
  const telegramPaddingRight = safeAreaInsets.right + contentSafeAreaInsets.right;

  // Use Telegram safe area values if available and non-zero, otherwise fall back to CSS env()
  const hasTelegramSafeArea = isTelegram && (
    telegramPaddingTop > 0 || 
    telegramPaddingBottom > 0 || 
    telegramPaddingLeft > 0 || 
    telegramPaddingRight > 0
  );

  // Build style object with safe area insets
  const containerStyle: CSSProperties = {
    minHeight: isTelegram ? 'var(--tg-viewport-stable-height, 100dvh)' : '100dvh',
  };

  if (hasTelegramSafeArea) {
    // Use Telegram's provided safe area values
    containerStyle.paddingTop = telegramPaddingTop > 0 ? `${telegramPaddingTop}px` : undefined;
    containerStyle.paddingBottom = telegramPaddingBottom > 0 ? `${telegramPaddingBottom}px` : undefined;
    containerStyle.paddingLeft = telegramPaddingLeft > 0 ? `${telegramPaddingLeft}px` : undefined;
    containerStyle.paddingRight = telegramPaddingRight > 0 ? `${telegramPaddingRight}px` : undefined;
  }

  return (
    <div 
      className={`relative flex min-h-screen w-full flex-col mx-auto overflow-hidden bg-background-light dark:bg-background-dark ${
        isTelegram 
          ? 'max-w-full shadow-none' 
          : 'max-w-md shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]'
      } ${!hasTelegramSafeArea ? 'safe-area-inset' : ''} ${className}`}
      style={containerStyle}
    >
      {children}
    </div>
  );
}
