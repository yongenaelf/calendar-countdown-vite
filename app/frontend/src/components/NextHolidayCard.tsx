import { useNavigate } from 'react-router-dom';
import { useCountdown } from '../hooks/useCountdown';
import type { Holiday } from '../types/holiday';

interface NextHolidayCardProps {
  holiday: Holiday;
  effectiveDate: Date;
}

const colorStyles = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/30',
    iconBg: 'bg-white/20',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    glow: 'shadow-sky-500/30',
    iconBg: 'bg-white/20',
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-500/30',
    iconBg: 'bg-white/20',
  },
  teal: {
    gradient: 'from-teal-500 to-teal-600',
    glow: 'shadow-teal-500/30',
    iconBg: 'bg-white/20',
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    glow: 'shadow-pink-500/30',
    iconBg: 'bg-white/20',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    glow: 'shadow-orange-500/30',
    iconBg: 'bg-white/20',
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function NextHolidayCard({ holiday, effectiveDate }: NextHolidayCardProps) {
  const navigate = useNavigate();
  const countdown = useCountdown(effectiveDate);
  const colors = colorStyles[holiday.color];

  const handleClick = () => {
    navigate(`/holiday/${holiday.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.gradient} shadow-xl ${colors.glow} transform transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
    >
      {/* Background decorations */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 flex shrink-0 items-center justify-center ${colors.iconBg} backdrop-blur-sm rounded-2xl text-white`}>
            <span className="material-symbols-outlined text-[28px]">{holiday.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm font-medium mb-1">Coming Up Next</p>
            <h2 className="text-2xl font-bold text-white leading-tight">{holiday.name}</h2>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-3xl font-bold text-white tabular-nums">
              {countdown.days}
            </div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wide mt-1">
              Days
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-3xl font-bold text-white tabular-nums">
              {countdown.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wide mt-1">
              Hours
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-3xl font-bold text-white tabular-nums">
              {countdown.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wide mt-1">
              Mins
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-3xl font-bold text-white tabular-nums">
              {countdown.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wide mt-1">
              Secs
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-white/80">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="text-sm font-medium">{formatDate(effectiveDate)}</span>
        </div>
      </div>
    </div>
  );
}
