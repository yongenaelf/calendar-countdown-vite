import { useNavigate } from 'react-router-dom';
import { useCountdown } from '../hooks/useCountdown';
import type { Holiday } from '../types/holiday';

interface HolidayCardProps {
  holiday: Holiday;
  variant?: 'featured' | 'standard' | 'compact';
}

const colorStyles = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/50',
    shadow: 'shadow-emerald-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-emerald-500 dark:text-emerald-400',
    dateText: 'text-emerald-600 dark:text-emerald-400',
    glow: 'bg-emerald-100 dark:bg-emerald-500/10',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-100 dark:border-sky-800/50',
    shadow: 'shadow-sky-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-sky-500 dark:text-sky-400',
    dateText: 'text-sky-600 dark:text-sky-400',
    glow: 'bg-sky-100 dark:bg-sky-500/10',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-100 dark:border-indigo-800/50',
    shadow: 'shadow-indigo-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-indigo-500 dark:text-indigo-400',
    dateText: 'text-indigo-600 dark:text-indigo-400',
    glow: 'bg-indigo-100 dark:bg-indigo-500/10',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-100 dark:border-teal-800/50',
    shadow: 'shadow-teal-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-teal-500 dark:text-teal-400',
    dateText: 'text-teal-600 dark:text-teal-400',
    glow: 'bg-teal-100 dark:bg-teal-500/10',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-100 dark:border-pink-800/50',
    shadow: 'shadow-pink-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-pink-500 dark:text-pink-400',
    dateText: 'text-pink-600 dark:text-pink-400',
    glow: 'bg-pink-100 dark:bg-pink-500/10',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-100 dark:border-orange-800/50',
    shadow: 'shadow-orange-500/5',
    iconBg: 'bg-white dark:bg-slate-700',
    iconText: 'text-orange-500 dark:text-orange-400',
    dateText: 'text-orange-600 dark:text-orange-400',
    glow: 'bg-orange-100 dark:bg-orange-500/10',
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
        <div className={`absolute -right-8 -top-8 w-40 h-40 ${colors.glow} rounded-full blur-3xl pointer-events-none`}></div>
        <div className="relative p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center justify-center px-3 py-1 bg-joy-yellow/20 text-yellow-700 dark:text-yellow-300 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-yellow-200/50">
                <span className="material-symbols-outlined text-[14px] mr-1">celebration</span> Upcoming
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{holiday.name}</h2>
              <p className={`${colors.dateText} font-medium text-sm`}>{formatDate(holiday.date)}</p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center ${colors.iconBg} rounded-2xl shadow-sm border ${colors.border} ${colors.iconText}`}>
              <span className="material-symbols-outlined text-[28px]">{holiday.icon}</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-6xl font-extrabold tracking-tighter text-joy-pink drop-shadow-sm">{countdown.days}</span>
            <span className="text-lg font-bold text-slate-400 dark:text-slate-500 mb-3">days left</span>
          </div>
          <div className="flex gap-2 p-3 bg-white/60 dark:bg-slate-900/50 rounded-xl backdrop-blur-md border border-white/50 dark:border-slate-800/50 mt-2">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-lg font-bold font-mono leading-none text-slate-700 dark:text-slate-200">{countdown.hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Hrs</span>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700 h-6 self-center"></div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-lg font-bold font-mono leading-none text-slate-700 dark:text-slate-200">{countdown.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Mins</span>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700 h-6 self-center"></div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-lg font-bold font-mono leading-none text-slate-700 dark:text-slate-200">{countdown.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Secs</span>
            </div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-gradient-to-r from-joy-pink to-joy-orange w-[85%] rounded-r-full shadow-[0_0_10px_rgba(244,114,182,0.5)]"></div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-3xl ${colors.bg} border ${colors.border} shadow-sm transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
      >
        <div className="relative p-4 flex items-center gap-4">
          <div className={`w-12 h-12 flex shrink-0 items-center justify-center ${colors.iconBg} text-joy-pink rounded-2xl border ${colors.border} shadow-sm`}>
            <span className="material-symbols-outlined text-[24px]">{holiday.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{holiday.name}</h3>
            <p className={`${colors.dateText} text-xs mt-0.5`}>{formatDate(holiday.date)}</p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-slate-900 dark:text-white leading-none">{countdown.days}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Days</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-joy-pink w-[20%]"></div>
      </div>
    );
  }

  // Standard variant
  return (
    <div 
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-3xl ${colors.bg} border ${colors.border} shadow-lg ${colors.shadow} transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
    >
      <div className={`absolute -left-10 -bottom-10 w-48 h-48 ${colors.glow} rounded-full blur-3xl pointer-events-none`}></div>
      <div className="relative p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 flex shrink-0 items-center justify-center ${colors.iconBg} rounded-2xl shadow-sm border ${colors.border} ${colors.iconText}`}>
            <span className="material-symbols-outlined text-[24px]">{holiday.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight text-slate-800 dark:text-white">{holiday.name}</h3>
            <p className={`${colors.dateText} text-sm font-medium`}>{formatDate(holiday.date)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-joy-orange drop-shadow-sm">{countdown.days}</span>
            <span className="text-sm font-medium text-slate-400">days to go</span>
          </div>
        </div>
      </div>
    </div>
  );
}
