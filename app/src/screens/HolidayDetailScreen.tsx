import { useNavigate, useParams } from 'react-router-dom';
import { MobileContainer, IconButton, Button } from '../components';
import { useCountdown } from '../hooks/useCountdown';

// Sample holiday data - in real app this would come from a store/API
const holidayData = {
  '1': {
    id: '1',
    name: 'Christmas',
    date: new Date('2025-12-25'),
    icon: 'forest',
    category: 'Religious',
    description: 'Christmas is an annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration.',
    recurrence: 'Repeats Yearly',
    source: 'Imported from US Holidays',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80',
  },
};

export function HolidayDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const holiday = holidayData[id as keyof typeof holidayData] || holidayData['1'];
  const countdown = useCountdown(holiday.date);
  
  const progress = 65; // Example progress percentage

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <MobileContainer>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 h-[45vh] w-full">
          <img 
            alt={holiday.name}
            className="h-full w-full object-cover opacity-60" 
            src={holiday.image}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-background-dark/80 to-background-dark"></div>
        </div>
        
        {/* Top Navigation */}
        <div className="relative z-10 flex items-center justify-between p-4 pt-12 pb-2">
          <IconButton 
            icon="arrow_back_ios_new" 
            variant="glass"
            onClick={() => navigate(-1)}
          />
          <div className="flex items-center gap-3">
            <IconButton icon="edit" variant="glass" onClick={() => navigate(`/edit/${holiday.id}`)} />
            <IconButton icon="ios_share" variant="glass" />
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center pt-4 pb-8">
          <h1 className="text-white text-4xl font-extrabold tracking-tight text-center drop-shadow-sm px-4">
            {holiday.name}
          </h1>
          
          {/* Date Badge */}
          <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 border border-white/5">
            <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
            <span className="text-white text-sm font-semibold tracking-wide">
              {holiday.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          
          {/* Countdown Timer */}
          <div className="w-full px-4 mt-10">
            <div className="flex gap-3 justify-center">
              {[
                { value: countdown.days, label: 'Days' },
                { value: countdown.hours, label: 'Hours' },
                { value: countdown.minutes, label: 'Mins' },
                { value: countdown.seconds, label: 'Secs' },
              ].map((item, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`flex h-20 w-full items-center justify-center rounded-2xl bg-surface-dark/80 backdrop-blur-md border border-white/5 shadow-lg relative overflow-hidden ${i === 3 ? 'bg-primary/10' : ''}`}>
                    <span className={`text-3xl font-black tracking-tight tabular-nums relative z-10 ${i === 3 ? 'text-primary' : 'text-white'}`}>
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider ${i === 3 ? 'text-primary' : 'text-slate-400'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
          <div className="p-6 flex flex-col gap-6">
            {/* Progress Section */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Progress</span>
                <span className="text-slate-900 dark:text-white text-sm font-bold">{progress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-surface-dark overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(43,173,238,0.5)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Last: Dec 25, 2024</span>
                <span>Next: Dec 25, 2025</span>
              </div>
            </div>
            
            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Details</h3>
              
              {/* Description Card */}
              <div className="rounded-2xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-slate-100 dark:border-white/5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">About this Holiday</h4>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {holiday.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <span className="material-symbols-outlined text-[20px]">update</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Recurrence</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{holiday.recurrence}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                    <span className="material-symbols-outlined text-[20px]">category</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Category</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{holiday.category}</p>
                  </div>
                </div>
              </div>
              
              {/* Source */}
              <div className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-400 font-medium">Source</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{holiday.source}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="mt-4 mb-8">
              <Button variant="danger" className="w-full" icon="delete">
                Delete Holiday
              </Button>
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-600">
                Version 2.4.0 • ID: #{holiday.id}
              </p>
            </div>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}
