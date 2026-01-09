import { useNavigate } from 'react-router-dom';
import { MobileContainer, Button } from '../components';
import { useTheme } from '../context';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleStart = () => {
    navigate('/holidays');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark min-h-screen">
      <MobileContainer className="bg-white/60 dark:bg-background-dark backdrop-blur-sm border-x border-white/40 dark:border-white/5">
        {/* Hero Section */}
        <div className="relative w-full h-[45vh] min-h-[380px]">
          <div className="absolute inset-0 w-full h-full rounded-b-[3rem] overflow-hidden z-0 shadow-soft dark:shadow-none">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ 
                backgroundImage: theme === 'dark' 
                  ? `url('https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80')` 
                  : `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80')` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90 dark:from-background-dark/20 dark:via-transparent dark:to-background-dark"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sky-100/40 to-transparent dark:from-primary/5 dark:to-transparent mix-blend-overlay"></div>
          </div>
          
          {/* App badge - Dark mode */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden dark:flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-primary text-lg">hourglass_top</span>
            <span className="text-white text-sm font-bold tracking-wide">COUNTDOWN</span>
          </div>
          
          {/* Floating badges - Light mode only */}
          <div className="absolute top-16 left-8 animate-bounce dark:hidden" style={{ animationDuration: '3.5s' }}>
            <div className="bg-joy-yellow text-amber-900 p-4 rounded-2xl shadow-xl shadow-yellow-200/50 rotate-[-12deg] transform border-2 border-white/80">
              <span className="text-3xl filter drop-shadow-sm">🎉</span>
            </div>
          </div>
          <div className="absolute top-28 right-8 animate-bounce dark:hidden" style={{ animationDuration: '4.5s', animationDelay: '0.7s' }}>
            <div className="bg-sky-200 text-sky-800 p-3 rounded-2xl shadow-xl shadow-sky-200/50 rotate-[12deg] transform border-2 border-white/80">
              <span className="text-2xl filter drop-shadow-sm">✈️</span>
            </div>
          </div>
          <div className="absolute top-52 left-6 animate-bounce dark:hidden" style={{ animationDuration: '5s', animationDelay: '0.3s' }}>
            <div className="bg-joy-pink text-white p-2.5 rounded-xl shadow-xl shadow-pink-200/50 rotate-[-6deg] transform border-2 border-white/80">
              <span className="text-xl filter drop-shadow-sm">🏖️</span>
            </div>
          </div>
          
          {/* Preview card */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] z-10 translate-y-8">
            <div className="bg-white dark:bg-surface-dark/90 dark:backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-3.5 flex items-center gap-4 border border-white dark:border-white/10 ring-4 ring-white/40 dark:ring-white/5">
              <div className="bg-emerald-50 dark:bg-emerald-500/20 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500 dark:text-emerald-400 shadow-inner dark:shadow-none">
                <span className="material-symbols-outlined text-[28px]">hourglass_top</span>
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Upcoming</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-2 py-0.5 rounded-full">Auto-Synced</span>
                </div>
                <div className="text-lg font-black text-slate-800 dark:text-white leading-none truncate">Summer Vacation</div>
              </div>
              <div className="bg-gradient-to-br from-joy-orange to-orange-400 text-white rounded-2xl min-w-[62px] h-16 flex flex-col items-center justify-center leading-none shadow-lg shadow-orange-100 dark:shadow-orange-500/20">
                <span className="text-3xl font-black tracking-tight">05</span>
                <span className="text-[10px] font-bold opacity-90 uppercase tracking-wide mt-0.5">Days</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col px-7 pt-16 pb-10">
          <div className="text-center mb-10 relative mt-4">
            <h1 className="text-[2.5rem] font-black text-slate-800 dark:text-white mb-3 leading-[1.05] tracking-tight">
              Anticipate{' '}
              <span className="relative inline-block text-primary z-10">
                Every
              </span>
              <br/>
              <span className="relative inline-block text-primary z-10">
                Moment
                <svg className="absolute w-[110%] h-4 -bottom-1 -left-1 text-joy-yellow dark:text-primary/30 -z-10 opacity-100" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 12 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="7"></path>
                </svg>
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] leading-relaxed max-w-[280px] mx-auto">
              Track birthdays, national holidays, and personal milestones with beautiful countdowns.
            </p>
          </div>
          
          {/* Feature cards */}
          <div className="flex flex-col gap-3.5 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white dark:bg-surface-dark border border-slate-50 dark:border-white/5 shadow-card dark:shadow-none hover:shadow-soft dark:hover:bg-surface-dark-elevated hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-100 dark:group-hover:bg-sky-500/30 transition-colors">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Sync Calendars</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Import from Apple Calendar & ICS files</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white dark:bg-surface-dark border border-slate-50 dark:border-white/5 shadow-card dark:shadow-none hover:shadow-soft dark:hover:bg-surface-dark-elevated hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-500 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-500/30 transition-colors">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Explore Holidays</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Quick add by Country & Religion</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white dark:bg-surface-dark border border-slate-50 dark:border-white/5 shadow-card dark:shadow-none hover:shadow-soft dark:hover:bg-surface-dark-elevated hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30 transition-colors">
                <span className="material-symbols-outlined text-[24px]">widgets</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">Home Widgets</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Beautiful widgets for your Home Screen</p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-auto">
            <Button onClick={handleStart} className="w-full" size="lg">
              Get Started
            </Button>
            <div className="flex justify-center gap-6 mt-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <a className="hover:text-joy-orange dark:hover:text-primary transition-colors" href="#">Restore Purchase</a>
              <a className="hover:text-joy-orange dark:hover:text-primary transition-colors" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}
