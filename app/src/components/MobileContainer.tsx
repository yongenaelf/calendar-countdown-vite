import type { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] ${className}`}>
      {children}
    </div>
  );
}
