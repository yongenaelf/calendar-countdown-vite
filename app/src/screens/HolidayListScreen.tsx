import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton, HolidayCard } from '../components';
import { useTheme, useHolidays } from '../context';

export function HolidayListScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { holidays } = useHolidays();
  
  // Sort holidays by date (upcoming first)
  const sortedHolidays = [...holidays].sort((a, b) => {
    const now = new Date();
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    // Put past dates at the end
    const aIsPast = dateA < now;
    const bIsPast = dateB < now;
    if (aIsPast && !bIsPast) return 1;
    if (!aIsPast && bIsPast) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <MobileContainer>
        {/* Background pattern - light mode only */}
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 bg-background-light/80 dark:bg-background-dark/90 backdrop-blur-xl border-b border-transparent dark:border-white/5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Holidays
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mt-1">{holidays.length} upcoming events</p>
          </div>
          <IconButton 
            icon={theme === 'dark' ? 'light_mode' : 'dark_mode'} 
            onClick={toggleTheme} 
          />
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-32 no-scrollbar relative z-10">
          {/* Quick actions */}
          <div className="px-6 py-3">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => navigate('/import')}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 dark:bg-surface-dark text-sky-600 dark:text-primary rounded-full font-semibold text-sm border border-sky-100 dark:border-white/10 active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                Import Calendar
              </button>
              <button 
                onClick={() => navigate('/browse')}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 dark:bg-surface-dark text-teal-600 dark:text-slate-300 rounded-full font-semibold text-sm border border-teal-100 dark:border-white/10 active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
                Public Holidays
              </button>
            </div>
          </div>
          
          {/* Holiday cards */}
          <div className="flex flex-col gap-4 px-6 pt-2">
            {sortedHolidays.map((holiday, index) => (
              <HolidayCard 
                key={holiday.id} 
                holiday={holiday} 
                variant={index === 0 ? 'featured' : index === sortedHolidays.length - 1 ? 'compact' : 'standard'}
              />
            ))}
          </div>
          
          <div className="h-24"></div>
        </main>
        
        {/* FAB */}
        <div className="absolute bottom-8 right-6 z-30">
          <button 
            onClick={() => navigate('/add')}
            className="group flex items-center justify-center w-16 h-16 bg-primary dark:bg-primary hover:bg-primary-light text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[32px]">add</span>
          </button>
        </div>
        
        {/* Bottom indicator */}
        <div className="absolute bottom-0 w-full h-1 bg-transparent pointer-events-none">
          <div className="mx-auto w-1/3 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-2"></div>
        </div>
      </MobileContainer>
    </div>
  );
}
