import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '../components';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ITEM_HEIGHT = 44;

interface PickerWheelProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function PickerWheel({ items, selectedIndex, onChange }: PickerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animationFrame = useRef<number>();

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (containerRef.current) {
      const targetScroll = index * ITEM_HEIGHT;
      const currentScroll = containerRef.current.scrollTop;
      // Only scroll if position differs significantly
      if (Math.abs(currentScroll - targetScroll) > ITEM_HEIGHT / 2) {
        if (smooth) {
          containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
        } else {
          containerRef.current.scrollTop = targetScroll;
        }
      }
    }
  }, []);

  // Scroll to selected index on mount and when it changes externally
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      // On initial mount, scroll without animation
      if (containerRef.current) {
        containerRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
      }
      isInitialMount.current = false;
    } else {
      // On subsequent changes (e.g., day clamping), scroll with animation
      scrollToIndex(selectedIndex, true);
    }
  }, [selectedIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && !isDragging) {
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      if (clampedIndex !== selectedIndex) {
        onChange(clampedIndex);
      }
    }
  }, [isDragging, items.length, selectedIndex, onChange]);

  const snapToNearest = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      scrollToIndex(clampedIndex);
      if (clampedIndex !== selectedIndex) {
        onChange(clampedIndex);
      }
    }
  }, [items.length, selectedIndex, onChange, scrollToIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startScrollTop.current = containerRef.current?.scrollTop || 0;
    lastY.current = e.touches[0].clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY.current - currentY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime.current;
    
    if (timeDelta > 0) {
      velocity.current = (lastY.current - currentY) / timeDelta;
    }
    
    lastY.current = currentY;
    lastTime.current = currentTime;
    
    containerRef.current.scrollTop = startScrollTop.current + deltaY;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Apply momentum scrolling
    if (Math.abs(velocity.current) > 0.5 && containerRef.current) {
      const momentum = velocity.current * 150;
      const targetScroll = containerRef.current.scrollTop + momentum;
      const targetIndex = Math.round(targetScroll / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
      scrollToIndex(clampedIndex);
      onChange(clampedIndex);
    } else {
      snapToNearest();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startScrollTop.current = containerRef.current?.scrollTop || 0;
    lastY.current = e.clientY;
    lastTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentY = e.clientY;
    const deltaY = startY.current - currentY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime.current;
    
    if (timeDelta > 0) {
      velocity.current = (lastY.current - currentY) / timeDelta;
    }
    
    lastY.current = currentY;
    lastTime.current = currentTime;
    
    containerRef.current.scrollTop = startScrollTop.current + deltaY;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      snapToNearest();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      snapToNearest();
    }
  };

  const handleItemClick = (index: number) => {
    scrollToIndex(index);
    onChange(index);
  };

  return (
    <div 
      ref={containerRef}
      className="h-[220px] overflow-y-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
      style={{ scrollSnapType: 'y mandatory' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onScroll={handleScroll}
    >
      {/* Top padding */}
      <div style={{ height: ITEM_HEIGHT * 2 }} />
      
      {items.map((item, index) => {
        const distance = Math.abs(index - selectedIndex);
        const isSelected = index === selectedIndex;
        
        return (
          <div
            key={index}
            className={`
              flex items-center justify-center transition-all duration-150
              ${isSelected 
                ? 'text-joy-orange dark:text-orange-400 font-bold scale-110' 
                : distance === 1 
                  ? 'text-slate-400 dark:text-slate-500 font-medium opacity-70' 
                  : 'text-slate-300 dark:text-slate-600 font-medium opacity-40'
              }
            `}
            style={{ 
              height: ITEM_HEIGHT,
              scrollSnapAlign: 'center',
              fontSize: isSelected ? '18px' : '16px',
              transform: `scale(${isSelected ? 1.1 : distance === 1 ? 0.95 : 0.9})`,
            }}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </div>
        );
      })}
      
      {/* Bottom padding */}
      <div style={{ height: ITEM_HEIGHT * 2 }} />
    </div>
  );
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function AddHolidayScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("Mom's Birthday");
  const [allDay, setAllDay] = useState(true);
  
  // Date state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate() - 1); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(0); // Index in years array
  
  // Generate years array (current year + 10 years)
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());
  
  // Generate days based on selected month and year
  const daysInMonth = getDaysInMonth(selectedMonth, parseInt(years[selectedYear]));
  const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  
  // Adjust day if it exceeds days in month
  useEffect(() => {
    if (selectedDay >= daysInMonth) {
      setSelectedDay(daysInMonth - 1);
    }
  }, [selectedMonth, selectedYear, daysInMonth, selectedDay]);

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
            
            {/* Date picker wheels */}
            <div className="relative bg-white dark:bg-background-dark py-2">
              <div className="w-full h-[220px] relative flex justify-center overflow-hidden">
                {/* Selection highlight */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 dark:from-slate-700/30 dark:to-slate-700/30 rounded-lg pointer-events-none z-0 mx-6 border-y border-orange-200/50 dark:border-slate-600/50"></div>
                
                {/* Picker wheels */}
                <div className="flex w-full z-10 text-center px-4">
                  <div className="w-1/3">
                    <PickerWheel
                      items={MONTHS}
                      selectedIndex={selectedMonth}
                      onChange={setSelectedMonth}
                    />
                  </div>
                  <div className="w-1/3">
                    <PickerWheel
                      items={days}
                      selectedIndex={selectedDay}
                      onChange={setSelectedDay}
                    />
                  </div>
                  <div className="w-1/3">
                    <PickerWheel
                      items={years}
                      selectedIndex={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>
                </div>
                
                {/* Top fade gradient */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/90 to-transparent dark:from-background-dark dark:via-background-dark/90 pointer-events-none z-20"></div>
                {/* Bottom fade gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-background-dark dark:via-background-dark/90 pointer-events-none z-20"></div>
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
