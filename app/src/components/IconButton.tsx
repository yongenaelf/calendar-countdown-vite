interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'solid';
  className?: string;
}

export function IconButton({ icon, onClick, variant = 'default', className = '' }: IconButtonProps) {
  const baseStyles = 'flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95';
  
  const variantStyles = {
    default: 'bg-white dark:bg-surface-dark shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:scale-105 hover:bg-slate-50 dark:hover:bg-surface-dark-elevated',
    glass: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10',
    solid: 'bg-primary text-slate-900 shadow-lg shadow-primary/30 hover:scale-110 hover:bg-primary-light',
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );
}
