import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  disabled = false
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none';
  
  const sizeStyles = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-joy-orange to-joy-pink hover:from-orange-500 hover:to-pink-500 text-white shadow-lg shadow-orange-200',
    secondary: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    text: 'bg-transparent text-slate-500 hover:text-slate-700',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
}
