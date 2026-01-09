import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '../components';

export function AddHolidayScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("Mom's Birthday");
  const [allDay, setAllDay] = useState(true);

  return (
    <div className="bg-sky-50 dark:bg-background-dark min-h-screen">
      <MobileContainer className="bg-sky-50 dark:bg-background-dark">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-sky-50/90 dark:bg-background-dark/80 backdrop-blur-md px-5 py-4 border-b border-sky-100 dark:border-slate-800 transition-colors">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-sky-600 dark:hover:text-slate-300 text-[17px] font-medium leading-normal tracking-wide shrink-0 active:opacity-70 transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-slate-800 dark:text-white text-[17px] font-bold leading-tight tracking-tight text-center flex-1">
            New Celebration ✨
          </h2>
          <button className="bg-joy-orange text-white px-5 py-1.5 rounded-full text-[15px] font-bold shadow-lg shadow-joy-orange/30 hover:shadow-joy-orange/50 active:scale-95 transition-all shrink-0">
            Add
          </button>
        </header>
        
        {/* Main content */}
        <main className="flex-1 w-full px-5 py-6 space-y-8 pb-32 overflow-y-auto no-scrollbar">
          {/* Icon and name */}
          <div className="flex flex-col items-center justify-center space-y-6 pt-2">
            <button className="group relative h-32 w-32 rounded-full bg-white dark:bg-surface-dark shadow-xl shadow-sky-200/50 dark:shadow-black/20 flex items-center justify-center transition-transform active:scale-95 border-4 border-white dark:border-surface-dark ring-4 ring-yellow-100 dark:ring-transparent">
              <span className="text-7xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">🎉</span>
              <div className="absolute -bottom-1 -right-1 bg-secondary text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md border-[3px] border-white dark:border-surface-dark group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-[20px] font-bold">edit</span>
              </div>
            </button>
            <div className="w-full text-center space-y-3">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your event"
                className="w-full bg-transparent border-none p-0 text-center text-[32px] font-extrabold text-slate-800 dark:text-white placeholder:text-sky-200 dark:placeholder:text-slate-700 focus:ring-0 tracking-tight"
              />
              <p className="text-secondary font-semibold text-[15px] animate-pulse">What are we looking forward to?</p>
            </div>
          </div>
          
          {/* Date picker card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800/50 overflow-hidden ring-1 ring-sky-50 dark:ring-white/5">
            <div className="px-5 py-4 flex items-center justify-between bg-sky-50/50 dark:bg-white/5 border-b border-sky-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-relax-green dark:bg-green-500/20 text-green-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-[15px]">When's the party?</h3>
                  <p className="text-xs text-sky-500 dark:text-sky-400 font-medium">Set the date</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">All Day</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={allDay}
                    onChange={(e) => setAllDay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-joy-yellow shadow-inner"></div>
                </label>
              </div>
            </div>
            
            {/* Date picker wheels simulation */}
            <div className="relative bg-white dark:bg-background-dark py-2">
              <div className="w-full h-44 relative flex justify-center overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 dark:from-slate-700/30 dark:to-slate-700/30 rounded-lg pointer-events-none z-0 mx-6 border-y border-orange-200/50 dark:border-slate-600/50"></div>
                <div className="flex w-full justify-around z-10 text-center px-4">
                  <div className="w-1/3 space-y-4 pt-14 text-[17px]">
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">October</div>
                    <div className="text-joy-orange dark:text-orange-400 font-bold scale-110">November</div>
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">December</div>
                    <div className="text-sky-300 scale-90 opacity-40 font-medium">January</div>
                  </div>
                  <div className="w-1/3 space-y-4 pt-14 text-[17px]">
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">23</div>
                    <div className="text-joy-orange dark:text-orange-400 font-bold scale-110">24</div>
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">25</div>
                    <div className="text-sky-300 scale-90 opacity-40 font-medium">26</div>
                  </div>
                  <div className="w-1/3 space-y-4 pt-14 text-[17px]">
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">2024</div>
                    <div className="text-joy-orange dark:text-orange-400 font-bold scale-110">2025</div>
                    <div className="text-sky-300 scale-90 opacity-60 font-medium">2026</div>
                    <div className="text-sky-300 scale-90 opacity-40 font-medium">2027</div>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/90 to-transparent dark:from-background-dark dark:via-background-dark/90 pointer-events-none z-20"></div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-background-dark dark:via-background-dark/90 pointer-events-none z-20"></div>
              </div>
            </div>
          </div>
          
          {/* Options */}
          <div className="space-y-4">
            <h3 className="ml-2 text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              The Fun Details <span className="text-lg">🎡</span>
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer active:bg-sky-50 dark:active:bg-slate-700/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">update</span>
                  </div>
                  <span className="text-[16px] font-semibold text-slate-900 dark:text-white">Make it a tradition?</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-joy-orange font-medium">Yearly</span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">chevron_right</span>
                </div>
              </div>
              <div className="h-px w-full bg-sky-100 dark:bg-slate-800 ml-16"></div>
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer active:bg-sky-50 dark:active:bg-slate-700/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  </div>
                  <span className="text-[16px] font-semibold text-slate-900 dark:text-white">Hype me up!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-slate-400">On day of event</span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">chevron_right</span>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800/50 overflow-hidden relative group focus-within:ring-2 focus-within:ring-secondary/50 transition-all">
              <div className="absolute top-4 left-5 text-secondary">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </div>
              <textarea 
                className="w-full bg-transparent border-none py-4 pl-14 pr-5 text-[16px] text-slate-900 dark:text-white placeholder:text-sky-300 focus:ring-0 focus:outline-none min-h-[100px] resize-none"
                placeholder="Any special plans or wishes? 📝"
              />
            </div>
          </div>
          
          {/* Footer note */}
          <div className="px-4 pb-4 pt-2">
            <p className="text-[13px] text-slate-500 text-center leading-relaxed">
              Start the countdown and get ready to celebrate!<br/>
              <span className="text-sky-500 font-medium">Syncs with your calendar automatically.</span>
            </p>
          </div>
        </main>
      </MobileContainer>
    </div>
  );
}
