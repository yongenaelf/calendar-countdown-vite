interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'solid';
  className?: string;
}

export function IconButton({ icon, onClick, variant = 'default', className = '' }: IconButtonProps) {
  const baseStyles = 'flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95';
  
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105',
    glass: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20',
    solid: 'bg-joy-pink text-white shadow-lg shadow-pink-500/30 hover:scale-110',
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
