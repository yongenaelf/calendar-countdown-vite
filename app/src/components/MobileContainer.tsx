import type { ReactNode } from 'react';
import { useTelegram } from '../context';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  const { isTelegram, safeAreaInsets, contentSafeAreaInsets } = useTelegram();

  // Calculate padding based on Telegram safe areas
  const paddingTop = isTelegram ? contentSafeAreaInsets.top + safeAreaInsets.top : 0;
  const paddingBottom = isTelegram ? contentSafeAreaInsets.bottom + safeAreaInsets.bottom : 0;

  return (
    <div 
      className={`relative flex min-h-screen w-full flex-col mx-auto overflow-hidden bg-background-light dark:bg-background-dark ${
        isTelegram 
          ? 'max-w-full shadow-none' 
          : 'max-w-md shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]'
      } ${className}`}
      style={isTelegram ? {
        minHeight: 'var(--tg-viewport-stable-height, 100vh)',
        paddingTop: paddingTop > 0 ? `${paddingTop}px` : undefined,
        paddingBottom: paddingBottom > 0 ? `${paddingBottom}px` : undefined,
      } : undefined}
    >
      {children}
    </div>
  );
}
