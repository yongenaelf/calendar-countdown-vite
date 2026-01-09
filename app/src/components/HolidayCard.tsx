import { useNavigate } from 'react-router-dom';
import { useCountdown } from '../hooks/useCountdown';
import type { Holiday } from '../types/holiday';

interface HolidayCardProps {
  holiday: Holiday;
  variant?: 'featured' | 'standard' | 'compact';
}

const colorStyles = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-surface-dark',
    border: 'border-emerald-100 dark:border-white/5',
    shadow: 'shadow-emerald-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-emerald-500/20',
    iconText: 'text-emerald-500 dark:text-emerald-400',
    dateText: 'text-emerald-600 dark:text-slate-400',
    glow: 'bg-emerald-100 dark:bg-emerald-500/5',
    badge: 'bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-surface-dark',
    border: 'border-sky-100 dark:border-white/5',
    shadow: 'shadow-sky-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-sky-500/20',
    iconText: 'text-sky-500 dark:text-sky-400',
    dateText: 'text-sky-600 dark:text-slate-400',
    glow: 'bg-sky-100 dark:bg-sky-500/5',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-surface-dark',
    border: 'border-indigo-100 dark:border-white/5',
    shadow: 'shadow-indigo-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-indigo-500/20',
    iconText: 'text-indigo-500 dark:text-indigo-400',
    dateText: 'text-indigo-600 dark:text-slate-400',
    glow: 'bg-indigo-100 dark:bg-indigo-500/5',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-surface-dark',
    border: 'border-teal-100 dark:border-white/5',
    shadow: 'shadow-teal-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-teal-500/20',
    iconText: 'text-teal-500 dark:text-teal-400',
    dateText: 'text-teal-600 dark:text-slate-400',
    glow: 'bg-teal-100 dark:bg-teal-500/5',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-surface-dark',
    border: 'border-pink-100 dark:border-white/5',
    shadow: 'shadow-pink-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-pink-500/20',
    iconText: 'text-pink-500 dark:text-pink-400',
    dateText: 'text-pink-600 dark:text-slate-400',
    glow: 'bg-pink-100 dark:bg-pink-500/5',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-surface-dark',
    border: 'border-orange-100 dark:border-white/5',
    shadow: 'shadow-orange-500/5 dark:shadow-none',
    iconBg: 'bg-white dark:bg-orange-500/20',
    iconText: 'text-orange-500 dark:text-orange-400',
    dateText: 'text-orange-600 dark:text-slate-400',
    glow: 'bg-orange-100 dark:bg-orange-500/5',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function HolidayCard({ holiday, variant = 'standard' }: HolidayCardProps) {
  const navigate = useNavigate();
  const countdown = useCountdown(holiday.date);
  const colors = colorStyles[holiday.color];

  const handleClick = () => {
    navigate(`/holiday/${holiday.id}`);
  };

  if (variant === 'featured') {
    return (
      <div 
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-3xl ${colors.bg} border ${colors.border} shadow-lg ${colors.shadow} transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
      >
        <div className={`absolute -right-8 -top-8 w-40 h-40 ${colors.glow} rounded-full blur-3xl pointer-events-none dark:opacity-50`}></div>
        <div className="relative p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 flex shrink-0 items-center justify-center ${colors.iconBg} rounded-2xl ${colors.iconText}`}>
              <span className="material-symbols-outlined text-[28px]">{holiday.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{holiday.name}</h2>
              <p className={`${colors.dateText} font-medium text-sm`}>{formatDate(holiday.date)}</p>
            </div>
            <div className={`${colors.badge} px-3 py-1.5 rounded-lg text-sm font-bold`}>
              {countdown.days} Days
            </div>
          </div>
          
          {/* Countdown timer row */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="font-mono font-semibold">
              {countdown.hours.toString().padStart(2, '0')}h {countdown.minutes.toString().padStart(2, '0')}m {countdown.seconds.toString().padStart(2, '0')}s
            </span>
            {/* Progress bar */}
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full ml-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[75%] transition-all"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-3xl ${colors.bg} border ${colors.border} shadow-sm ${colors.shadow} transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
      >
        <div className="relative p-4 flex items-center gap-4">
          <div className={`w-12 h-12 flex shrink-0 items-center justify-center ${colors.iconBg} ${colors.iconText} rounded-2xl`}>
            <span className="material-symbols-outlined text-[24px]">{holiday.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{holiday.name}</h3>
            <p className={`${colors.dateText} text-xs mt-0.5`}>{formatDate(holiday.date)}</p>
          </div>
          <div className={`${colors.badge} px-3 py-1.5 rounded-lg text-sm font-bold`}>
            {countdown.days} Days
          </div>
        </div>
      </div>
    );
  }

  // Standard variant
  return (
    <div 
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl ${colors.bg} border ${colors.border} shadow-lg ${colors.shadow} transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
    >
      <div className={`absolute -left-10 -bottom-10 w-48 h-48 ${colors.glow} rounded-full blur-3xl pointer-events-none dark:opacity-50`}></div>
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 flex shrink-0 items-center justify-center ${colors.iconBg} rounded-2xl ${colors.iconText}`}>
            <span className="material-symbols-outlined text-[24px]">{holiday.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight text-slate-800 dark:text-white">{holiday.name}</h3>
            <p className={`${colors.dateText} text-sm font-medium`}>{formatDate(holiday.date)}</p>
          </div>
          <div className={`${colors.badge} px-3 py-1.5 rounded-lg text-sm font-bold`}>
            {countdown.days} Days
          </div>
        </div>
        
        {/* Additional info row */}
        {holiday.date.getHours() !== 0 && (
          <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="font-medium">
              {holiday.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
