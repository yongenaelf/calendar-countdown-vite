import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton } from '../components';
import { useHolidays } from '../context';
import type { Holiday } from '../types/holiday';

// Day names for display
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface LongWeekendOpportunity {
  id: string;
  holiday: Holiday;
  holidayDate: Date;
  leaveDays: Date[];
  totalDaysOff: number;
  efficiency: number; // Total days off per leave day taken
  startDate: Date;
  endDate: Date;
  description: string;
}

// Calculate the next occurrence of a recurring event
function getNextOccurrence(date: Date, recurrence: Holiday['recurrence']): Date {
  const now = new Date();
  const eventDate = new Date(date);
  
  if (eventDate > now) return eventDate;
  if (!recurrence || recurrence === 'none') return eventDate;
  
  const nextDate = new Date(eventDate);
  
  switch (recurrence) {
    case 'yearly':
      while (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;
    case 'monthly':
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;
    case 'weekly':
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      break;
  }
  
  return nextDate;
}

// Check if a date is a weekend
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// Add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Format date range
function formatDateRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}

// Find long weekend opportunities
function findLongWeekendOpportunities(
  holidays: Holiday[],
  allHolidayDates: Set<string>
): LongWeekendOpportunity[] {
  const opportunities: LongWeekendOpportunity[] = [];
  const now = new Date();
  
  // Process each holiday
  holidays.forEach(holiday => {
    const holidayDate = getNextOccurrence(holiday.date, holiday.recurrence);
    
    // Skip past holidays
    if (holidayDate < now) return;
    
    // Skip if more than 12 months away
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (holidayDate > oneYearFromNow) return;
    
    const dayOfWeek = holidayDate.getDay();
    
    // Skip if holiday is on weekend (already a day off)
    if (isWeekend(holidayDate)) return;
    
    let opportunity: LongWeekendOpportunity | null = null;
    
    // Monday holiday: Already a 3-day weekend (Sat-Sun-Mon)
    if (dayOfWeek === 1) {
      // Check if taking Friday off makes it a 4-day weekend
      const friday = addDays(holidayDate, -3);
      if (!isHolidayOrWeekend(friday, allHolidayDates)) {
        opportunity = {
          id: `${holiday.id}-mon-extended`,
          holiday,
          holidayDate,
          leaveDays: [friday],
          totalDaysOff: 4,
          efficiency: 4,
          startDate: friday,
          endDate: holidayDate,
          description: `Take Friday off for a 4-day weekend`,
        };
      } else {
        // Already a natural long weekend
        opportunity = {
          id: `${holiday.id}-mon`,
          holiday,
          holidayDate,
          leaveDays: [],
          totalDaysOff: 3,
          efficiency: Infinity,
          startDate: addDays(holidayDate, -2),
          endDate: holidayDate,
          description: `Natural 3-day long weekend`,
        };
      }
    }
    
    // Tuesday holiday: Take Monday off for 4-day weekend
    else if (dayOfWeek === 2) {
      const monday = addDays(holidayDate, -1);
      if (!isHolidayOrWeekend(monday, allHolidayDates)) {
        opportunity = {
          id: `${holiday.id}-tue`,
          holiday,
          holidayDate,
          leaveDays: [monday],
          totalDaysOff: 4,
          efficiency: 4,
          startDate: addDays(holidayDate, -3),
          endDate: holidayDate,
          description: `Take Monday off for a 4-day weekend`,
        };
      }
    }
    
    // Wednesday holiday: Take Mon+Tue or Thu+Fri for 5-day break
    else if (dayOfWeek === 3) {
      const monday = addDays(holidayDate, -2);
      const tuesday = addDays(holidayDate, -1);
      const thursday = addDays(holidayDate, 1);
      const friday = addDays(holidayDate, 2);
      
      // Check which option is better
      const monTueAvailable = !isHolidayOrWeekend(monday, allHolidayDates) && 
                              !isHolidayOrWeekend(tuesday, allHolidayDates);
      const thuFriAvailable = !isHolidayOrWeekend(thursday, allHolidayDates) && 
                              !isHolidayOrWeekend(friday, allHolidayDates);
      
      if (monTueAvailable && thuFriAvailable) {
        // Take all 4 days for a 9-day break
        opportunity = {
          id: `${holiday.id}-wed-full`,
          holiday,
          holidayDate,
          leaveDays: [monday, tuesday, thursday, friday],
          totalDaysOff: 9,
          efficiency: 9 / 4,
          startDate: addDays(holidayDate, -4),
          endDate: addDays(holidayDate, 4),
          description: `Take 4 days for a 9-day mega break`,
        };
      } else if (monTueAvailable) {
        opportunity = {
          id: `${holiday.id}-wed-before`,
          holiday,
          holidayDate,
          leaveDays: [monday, tuesday],
          totalDaysOff: 5,
          efficiency: 5 / 2,
          startDate: addDays(holidayDate, -4),
          endDate: holidayDate,
          description: `Take Mon-Tue off for a 5-day break`,
        };
      } else if (thuFriAvailable) {
        opportunity = {
          id: `${holiday.id}-wed-after`,
          holiday,
          holidayDate,
          leaveDays: [thursday, friday],
          totalDaysOff: 5,
          efficiency: 5 / 2,
          startDate: holidayDate,
          endDate: addDays(holidayDate, 4),
          description: `Take Thu-Fri off for a 5-day break`,
        };
      }
    }
    
    // Thursday holiday: Take Friday off for 4-day weekend
    else if (dayOfWeek === 4) {
      const friday = addDays(holidayDate, 1);
      if (!isHolidayOrWeekend(friday, allHolidayDates)) {
        opportunity = {
          id: `${holiday.id}-thu`,
          holiday,
          holidayDate,
          leaveDays: [friday],
          totalDaysOff: 4,
          efficiency: 4,
          startDate: holidayDate,
          endDate: addDays(holidayDate, 3),
          description: `Take Friday off for a 4-day weekend`,
        };
      }
    }
    
    // Friday holiday: Already a 3-day weekend (Fri-Sat-Sun)
    else if (dayOfWeek === 5) {
      // Check if taking Monday off makes it a 4-day weekend
      const monday = addDays(holidayDate, 3);
      if (!isHolidayOrWeekend(monday, allHolidayDates)) {
        opportunity = {
          id: `${holiday.id}-fri-extended`,
          holiday,
          holidayDate,
          leaveDays: [monday],
          totalDaysOff: 4,
          efficiency: 4,
          startDate: holidayDate,
          endDate: monday,
          description: `Take Monday off for a 4-day weekend`,
        };
      } else {
        // Already a natural long weekend
        opportunity = {
          id: `${holiday.id}-fri`,
          holiday,
          holidayDate,
          leaveDays: [],
          totalDaysOff: 3,
          efficiency: Infinity,
          startDate: holidayDate,
          endDate: addDays(holidayDate, 2),
          description: `Natural 3-day long weekend`,
        };
      }
    }
    
    if (opportunity) {
      opportunities.push(opportunity);
    }
  });
  
  // Sort by date, then by efficiency
  return opportunities.sort((a, b) => {
    const dateDiff = a.holidayDate.getTime() - b.holidayDate.getTime();
    if (dateDiff !== 0) return dateDiff;
    return b.efficiency - a.efficiency;
  });
}

// Check if a date is a holiday or weekend
function isHolidayOrWeekend(date: Date, holidayDates: Set<string>): boolean {
  if (isWeekend(date)) return true;
  const dateStr = date.toISOString().split('T')[0];
  return holidayDates.has(dateStr);
}

// Get color classes based on efficiency
function getEfficiencyColor(efficiency: number): { bg: string; text: string; badge: string } {
  if (efficiency === Infinity) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    };
  }
  if (efficiency >= 4) {
    return {
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      text: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
    };
  }
  if (efficiency >= 2.5) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    };
  }
  return {
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
  };
}

export function LeavePlannerScreen() {
  const navigate = useNavigate();
  const { holidays } = useHolidays();
  
  // Build set of all holiday dates for quick lookup
  const allHolidayDates = useMemo(() => {
    const dates = new Set<string>();
    holidays.forEach(h => {
      const nextDate = getNextOccurrence(h.date, h.recurrence);
      dates.add(nextDate.toISOString().split('T')[0]);
    });
    return dates;
  }, [holidays]);
  
  // Find opportunities
  const opportunities = useMemo(() => {
    return findLongWeekendOpportunities(holidays, allHolidayDates);
  }, [holidays, allHolidayDates]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const naturalLongWeekends = opportunities.filter(o => o.leaveDays.length === 0).length;
    const totalLeaveDays = opportunities
      .filter(o => o.leaveDays.length > 0)
      .reduce((sum, o) => sum + o.leaveDays.length, 0);
    const totalDaysOff = opportunities
      .filter(o => o.leaveDays.length > 0)
      .reduce((sum, o) => sum + o.totalDaysOff, 0);
    
    return {
      naturalLongWeekends,
      totalLeaveDays,
      totalDaysOff,
      opportunities: opportunities.length,
    };
  }, [opportunities]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark min-h-screen">
      <MobileContainer className="bg-white/60 dark:bg-background-dark backdrop-blur-sm">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-background-dark/95 backdrop-blur-xl border-b border-white/50 dark:border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <IconButton 
              icon="arrow_back_ios_new" 
              onClick={() => navigate(-1)}
              className="bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
            />
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">Leave Planner</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-8 no-scrollbar">
          {/* Hero Section */}
          <div className="px-6 py-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 mb-4">
              <span className="material-symbols-outlined text-3xl">flight_takeoff</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Maximize Your Time Off
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Smart suggestions to turn your holidays into long weekends and extended breaks.
            </p>
          </div>
          
          {/* Stats Cards */}
          {opportunities.length > 0 && (
            <div className="px-6 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-emerald-500 text-xl">calendar_month</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Natural</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.naturalLongWeekends}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Long weekends</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-indigo-500 text-xl">event_available</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Potential</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDaysOff}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Days off with {stats.totalLeaveDays} leave</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Opportunities List */}
          <div className="px-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              {opportunities.length > 0 ? 'Opportunities' : 'No Opportunities Found'}
            </h3>
            
            {opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
                    calendar_month
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-[240px]">
                  Add some holidays to your list to see leave planning suggestions.
                </p>
                <button
                  onClick={() => navigate('/browse')}
                  className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                >
                  Browse Holidays
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {opportunities.map((opp) => {
                  const colors = getEfficiencyColor(opp.efficiency);
                  const holidayDay = dayNames[opp.holidayDate.getDay()];
                  
                  return (
                    <div 
                      key={opp.id}
                      className={`${colors.bg} rounded-2xl p-4 border border-white/50 dark:border-white/5 shadow-sm`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {opp.holiday.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {holidayDay}, {opp.holidayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className={`${colors.badge} px-2.5 py-1 rounded-lg text-xs font-bold`}>
                          {opp.totalDaysOff} days
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-sm font-medium ${colors.text} mb-3`}>
                        {opp.description}
                      </p>
                      
                      {/* Calendar visualization */}
                      <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {formatDateRange(opp.startDate, opp.endDate)}
                          </span>
                          {opp.leaveDays.length > 0 && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {opp.leaveDays.length} leave day{opp.leaveDays.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        {/* Day pills */}
                        <div className="flex gap-1 flex-wrap">
                          {Array.from({ length: Math.ceil((opp.endDate.getTime() - opp.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 }).map((_, i) => {
                            const date = addDays(opp.startDate, i);
                            const isHoliday = isSameDay(date, opp.holidayDate);
                            const isLeaveDay = opp.leaveDays.some(ld => isSameDay(ld, date));
                            const isWeekendDay = isWeekend(date);
                            
                            let bgColor = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
                            if (isHoliday) {
                              bgColor = 'bg-primary text-white';
                            } else if (isLeaveDay) {
                              bgColor = 'bg-amber-400 dark:bg-amber-500 text-white';
                            } else if (isWeekendDay) {
                              bgColor = 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
                            }
                            
                            return (
                              <div
                                key={i}
                                className={`${bgColor} px-2 py-1 rounded-md text-xs font-semibold min-w-[36px] text-center`}
                                title={date.toLocaleDateString()}
                              >
                                {shortDayNames[date.getDay()]}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex gap-3 mt-3 text-[10px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded bg-primary"></div>
                            <span>Holiday</span>
                          </div>
                          {opp.leaveDays.length > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 rounded bg-amber-400 dark:bg-amber-500"></div>
                              <span>Leave</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-500/20"></div>
                            <span>Weekend</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Tips Section */}
          {opportunities.length > 0 && (
            <div className="px-6 mt-8 mb-4">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-2xl p-5 border border-indigo-200/50 dark:border-indigo-500/10">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 text-xl mt-0.5">lightbulb</span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Pro Tip</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Thursday and Monday holidays are the best for long weekends - just 1 leave day gets you 4 days off! 
                      Wednesday holidays can give you up to 9 days off with 4 leave days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </MobileContainer>
    </div>
  );
}
