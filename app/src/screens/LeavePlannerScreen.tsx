import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton } from '../components';
import { useHolidays } from '../context';
import type { Holiday } from '../types/holiday';

const LEAVE_STORAGE_KEY = 'leave-planner-total-days';
const SELECTED_STORAGE_KEY = 'leave-planner-selected';

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
  
  // Load saved state from localStorage
  const [totalLeaveDays, setTotalLeaveDays] = useState<number>(() => {
    const saved = localStorage.getItem(LEAVE_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 14; // Default 14 days
  });
  
  const [selectedOpportunities, setSelectedOpportunities] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(SELECTED_STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
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
  
  // Calculate consumed leave days from selected opportunities
  const consumedLeaveDays = useMemo(() => {
    return opportunities
      .filter(o => selectedOpportunities.has(o.id))
      .reduce((sum, o) => sum + o.leaveDays.length, 0);
  }, [opportunities, selectedOpportunities]);
  
  // Calculate total days off from selected opportunities
  const totalSelectedDaysOff = useMemo(() => {
    return opportunities
      .filter(o => selectedOpportunities.has(o.id))
      .reduce((sum, o) => sum + o.totalDaysOff, 0);
  }, [opportunities, selectedOpportunities]);
  
  const remainingLeaveDays = totalLeaveDays - consumedLeaveDays;
  const progressPercent = totalLeaveDays > 0 ? (consumedLeaveDays / totalLeaveDays) * 100 : 0;
  
  // Save to localStorage when values change
  const handleTotalLeaveDaysChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(365, value));
    setTotalLeaveDays(clampedValue);
    localStorage.setItem(LEAVE_STORAGE_KEY, clampedValue.toString());
  };
  
  const toggleOpportunity = (oppId: string, leaveDaysRequired: number) => {
    setSelectedOpportunities(prev => {
      const next = new Set(prev);
      if (next.has(oppId)) {
        next.delete(oppId);
      } else {
        // Only allow selection if enough leave days remaining
        if (remainingLeaveDays >= leaveDaysRequired) {
          next.add(oppId);
        }
      }
      localStorage.setItem(SELECTED_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };
  
  // Calculate stats
  const stats = useMemo(() => {
    const naturalLongWeekends = opportunities.filter(o => o.leaveDays.length === 0).length;
    
    return {
      naturalLongWeekends,
      opportunities: opportunities.length,
    };
  }, [opportunities]);
  
  // Separate selected and unselected opportunities
  const { selectedOps, unselectedOps } = useMemo(() => {
    const selected: LongWeekendOpportunity[] = [];
    const unselected: LongWeekendOpportunity[] = [];
    
    opportunities.forEach(opp => {
      if (selectedOpportunities.has(opp.id)) {
        selected.push(opp);
      } else {
        unselected.push(opp);
      }
    });
    
    return { selectedOps: selected, unselectedOps: unselected };
  }, [opportunities, selectedOpportunities]);

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
              Select opportunities below to plan your leave days.
            </p>
          </div>
          
          {/* Leave Budget Input */}
          {opportunities.length > 0 && (
            <div className="px-6 mb-6">
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Annual Leave Budget</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">How many leave days do you have?</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTotalLeaveDaysChange(totalLeaveDays - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <input
                      type="number"
                      value={totalLeaveDays}
                      onChange={(e) => handleTotalLeaveDaysChange(parseInt(e.target.value) || 0)}
                      className="w-14 h-10 text-center text-lg font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      min="0"
                      max="365"
                    />
                    <button
                      onClick={() => handleTotalLeaveDaysChange(totalLeaveDays + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {consumedLeaveDays} of {totalLeaveDays} days used
                    </span>
                    <span className={`font-bold ${remainingLeaveDays > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {remainingLeaveDays} remaining
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        progressPercent > 90 ? 'bg-red-500' : 
                        progressPercent > 70 ? 'bg-amber-500' : 
                        'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>
                
                {/* Summary Stats */}
                {selectedOpportunities.size > 0 && (
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-500 text-lg">check_circle</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {selectedOpportunities.size} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-lg">celebration</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {totalSelectedDaysOff} total days off
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Stats Cards */}
          {opportunities.length > 0 && stats.naturalLongWeekends > 0 && (
            <div className="px-6 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      {stats.naturalLongWeekends} Natural Long Weekend{stats.naturalLongWeekends > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      No leave required - already scheduled!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Opportunities List */}
          <div className="px-6">
            {opportunities.length === 0 ? (
              <>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  No Opportunities Found
                </h3>
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
              </>
            ) : (
              <>
                {/* Selected Opportunities - Compact Stacked Group */}
                {selectedOps.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      Your Planned Leave ({selectedOps.length})
                    </h3>
                    <div className="bg-gradient-to-br from-primary/5 to-indigo-500/5 dark:from-primary/10 dark:to-indigo-500/10 rounded-2xl border-2 border-primary/20 dark:border-primary/30 overflow-hidden">
                      {selectedOps.map((opp, index) => {
                        const isLast = index === selectedOps.length - 1;
                        
                        return (
                          <div 
                            key={opp.id}
                            onClick={() => toggleOpportunity(opp.id, opp.leaveDays.length)}
                            className={`
                              flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-primary/10 transition-colors
                              ${!isLast ? 'border-b border-primary/10 dark:border-primary/20' : ''}
                            `}
                          >
                            {/* Check icon */}
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                            
                            {/* Holiday info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                {opp.holiday.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDateRange(opp.startDate, opp.endDate)}
                              </p>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded">
                                {opp.leaveDays.length}L
                              </span>
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {opp.totalDaysOff}D
                              </span>
                            </div>
                            
                            {/* Remove hint */}
                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">
                              close
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Unselected Opportunities - Full Cards */}
                {unselectedOps.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      {selectedOps.length > 0 ? 'More Opportunities' : 'Select Your Long Weekends'}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {unselectedOps.map((opp) => {
                        const colors = getEfficiencyColor(opp.efficiency);
                        const holidayDay = dayNames[opp.holidayDate.getDay()];
                        const requiresLeave = opp.leaveDays.length > 0;
                        const canSelect = !requiresLeave || remainingLeaveDays >= opp.leaveDays.length;
                        
                        return (
                          <div 
                            key={opp.id}
                            onClick={() => requiresLeave && canSelect && toggleOpportunity(opp.id, opp.leaveDays.length)}
                            className={`
                              ${colors.bg} rounded-2xl p-4 border-2 shadow-sm transition-all
                              border-white/50 dark:border-white/5
                              ${requiresLeave && canSelect ? 'cursor-pointer active:scale-[0.98]' : ''}
                              ${requiresLeave && !canSelect ? 'opacity-50' : ''}
                            `}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                {/* Selection indicator */}
                                {requiresLeave && (
                                  <div className={`
                                    mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                    ${canSelect 
                                      ? 'border-slate-300 dark:border-slate-600' 
                                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                                    }
                                  `} />
                                )}
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                    {opp.holiday.name}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {holidayDay}, {opp.holidayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className={`${colors.badge} px-2.5 py-1 rounded-lg text-xs font-bold`}>
                                  {opp.totalDaysOff} days off
                                </div>
                                {requiresLeave && (
                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    {opp.leaveDays.length} leave
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className={`text-sm font-medium ${colors.text} mb-3 ${requiresLeave ? 'ml-9' : ''}`}>
                              {opp.description}
                            </p>
                            
                            {/* Calendar visualization */}
                            <div className={`bg-white/60 dark:bg-white/5 rounded-xl p-3 ${requiresLeave ? 'ml-9' : ''}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                  {formatDateRange(opp.startDate, opp.endDate)}
                                </span>
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
                                    bgColor = 'bg-amber-200 dark:bg-amber-500/40 text-amber-700 dark:text-amber-300';
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
                                    <div className="w-2.5 h-2.5 rounded bg-amber-200 dark:bg-amber-500/40"></div>
                                    <span>Leave</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-500/20"></div>
                                  <span>Weekend</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Disabled message */}
                            {requiresLeave && !canSelect && (
                              <p className="text-xs text-red-500 dark:text-red-400 mt-2 ml-9">
                                Not enough leave days remaining
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
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
                      Tap on the cards with leave days to select them. Thursday and Monday holidays are the most efficient - just 1 leave day gets you 4 days off!
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
