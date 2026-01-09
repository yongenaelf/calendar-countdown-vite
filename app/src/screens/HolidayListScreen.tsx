import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton, HolidayCard } from '../components';
import type { Holiday } from '../types/holiday';

// Sample data
const holidays: Holiday[] = [
  {
    id: '1',
    name: 'Christmas',
    date: new Date('2025-12-25'),
    icon: 'forest',
    category: 'religious',
    color: 'emerald',
    description: 'Christmas is an annual festival commemorating the birth of Jesus Christ.',
    recurrence: 'yearly',
    source: 'US Holidays',
  },
  {
    id: '2',
    name: 'Trip to Bali',
    date: new Date('2026-01-15T10:00:00'),
    icon: 'flight_takeoff',
    category: 'travel',
    color: 'sky',
    description: 'Annual vacation to Bali, Indonesia.',
  },
  {
    id: '3',
    name: "New Year's Eve",
    date: new Date('2025-12-31'),
    icon: 'celebration',
    category: 'celebration',
    color: 'indigo',
    recurrence: 'yearly',
  },
  {
    id: '4',
    name: "Mom's Birthday",
    date: new Date('2026-02-20'),
    icon: 'cake',
    category: 'birthday',
    color: 'teal',
    recurrence: 'yearly',
  },
];

export function HolidayListScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <MobileContainer>
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-transparent">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Events <span className="text-joy-yellow drop-shadow-sm">🎉</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Make every day count!</p>
          </div>
          <IconButton icon="settings" onClick={() => {}} />
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-32 no-scrollbar relative z-10">
          {/* Quick actions */}
          <div className="px-6 py-2">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => navigate('/import')}
                className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 rounded-full font-semibold text-sm border border-sky-100 dark:border-sky-500/20 active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                Import
              </button>
              <button 
                onClick={() => navigate('/browse')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 rounded-full font-semibold text-sm border border-teal-100 dark:border-teal-500/20 active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">public</span>
                Public
              </button>
              <button 
                onClick={() => navigate('/widget')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full font-semibold text-sm border border-indigo-100 dark:border-indigo-500/20 active:scale-95 transition-transform whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">widgets</span>
                Widget
              </button>
            </div>
          </div>
          
          {/* Holiday cards */}
          <div className="flex flex-col gap-5 px-6 pt-4">
            {holidays.map((holiday, index) => (
              <HolidayCard 
                key={holiday.id} 
                holiday={holiday} 
                variant={index === 0 ? 'featured' : index === holidays.length - 1 ? 'compact' : 'standard'}
              />
            ))}
          </div>
          
          <div className="h-24"></div>
        </main>
        
        {/* FAB */}
        <div className="absolute bottom-8 right-6 z-30">
          <button 
            onClick={() => navigate('/add')}
            className="group flex items-center justify-center w-16 h-16 bg-joy-pink hover:bg-joy-pink-dark text-white rounded-full shadow-xl shadow-pink-500/30 hover:scale-110 hover:-rotate-90 transition-all duration-300"
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
