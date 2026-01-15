import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton, HolidayCard } from '../components';
import { useTheme, useHolidays } from '../context';
import type { Holiday } from '../types/holiday';

// Calculate the next occurrence of a recurring event
function getNextOccurrence(date: Date, recurrence: Holiday['recurrence']): Date {
  const now = new Date();
  const eventDate = new Date(date);
  
  // If the event is in the future, return the original date
  if (eventDate > now) {
    return eventDate;
  }
  
  // If no recurrence or 'none', return the original date (will be filtered out later)
  if (!recurrence || recurrence === 'none') {
    return eventDate;
  }
  
  const nextDate = new Date(eventDate);
  
  switch (recurrence) {
    case 'yearly':
      // Keep incrementing year until we're in the future
      while (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;
    case 'monthly':
      // Keep incrementing month until we're in the future
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;
    case 'weekly':
      // Keep incrementing week until we're in the future
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      break;
  }
  
  return nextDate;
}

// Check if an event should be shown (not a past one-time event)
function shouldShowHoliday(holiday: Holiday): boolean {
  const now = new Date();
  const eventDate = new Date(holiday.date);
  
  // If event is in the future, always show
  if (eventDate > now) {
    return true;
  }
  
  // If event is in the past and has no recurrence, hide it
  if (!holiday.recurrence || holiday.recurrence === 'none') {
    return false;
  }
  
  // Recurring events are always shown (with next occurrence)
  return true;
}

export function HolidayListScreen() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { holidays, clearAllHolidays } = useHolidays();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Filter out past one-time events and sort by next occurrence date
  const visibleHolidays = holidays
    .filter(shouldShowHoliday)
    .map(holiday => ({
      ...holiday,
      effectiveDate: getNextOccurrence(holiday.date, holiday.recurrence),
    }))
    .sort((a, b) => a.effectiveDate.getTime() - b.effectiveDate.getTime());

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
            <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mt-1">{visibleHolidays.length} upcoming events</p>
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
              {holidays.length > 0 && (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-surface-dark text-red-500 dark:text-red-400 rounded-full font-semibold text-sm border border-red-100 dark:border-white/10 active:scale-95 transition-transform whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Holiday cards */}
          <div className="flex flex-col gap-4 px-6 pt-2">
            {visibleHolidays.map((holiday, index) => (
              <HolidayCard 
                key={holiday.id} 
                holiday={holiday}
                effectiveDate={holiday.effectiveDate}
                variant={index === 0 ? 'featured' : index === visibleHolidays.length - 1 ? 'compact' : 'standard'}
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

        {/* Clear All Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Clear All Events?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  This will permanently delete all {holidays.length} events. This action cannot be undone.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clearAllHolidays();
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold active:scale-95 transition-transform"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MobileContainer>
    </div>
  );
}
