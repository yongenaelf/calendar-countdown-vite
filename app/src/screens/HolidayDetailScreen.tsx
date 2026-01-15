import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileContainer, IconButton, Button } from '../components';
import { useCountdown } from '../hooks/useCountdown';
import { useHolidays } from '../context';
import type { Holiday } from '../types/holiday';

// Default images for different categories
const categoryImages: Record<string, string> = {
  religious: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80',
  celebration: 'https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&q=80',
  birthday: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80',
  travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  custom: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
};

// Format recurrence for display
function formatRecurrence(recurrence?: Holiday['recurrence']): string {
  if (!recurrence || recurrence === 'none') return 'One-time event';
  switch (recurrence) {
    case 'yearly': return 'Repeats Yearly';
    case 'monthly': return 'Repeats Monthly';
    case 'weekly': return 'Repeats Weekly';
    default: return 'One-time event';
  }
}

// Format category for display
function formatCategory(category: Holiday['category']): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
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

// Calculate progress between last and next occurrence
function calculateProgress(date: Date, recurrence: Holiday['recurrence']): { progress: number; lastDate: Date; nextDate: Date } {
  const now = new Date();
  const nextDate = getNextOccurrence(date, recurrence);
  
  // Calculate last occurrence
  const lastDate = new Date(nextDate);
  switch (recurrence) {
    case 'yearly':
      lastDate.setFullYear(lastDate.getFullYear() - 1);
      break;
    case 'monthly':
      lastDate.setMonth(lastDate.getMonth() - 1);
      break;
    case 'weekly':
      lastDate.setDate(lastDate.getDate() - 7);
      break;
    default:
      // For one-time events, set lastDate to a year before
      lastDate.setFullYear(lastDate.getFullYear() - 1);
  }
  
  const totalDuration = nextDate.getTime() - lastDate.getTime();
  const elapsed = now.getTime() - lastDate.getTime();
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  
  return { progress, lastDate, nextDate };
}

export function HolidayDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getHoliday, deleteHoliday } = useHolidays();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const holiday = getHoliday(id || '');
  
  // Calculate effective date - use fallback for when holiday is not found
  const effectiveDate = holiday 
    ? getNextOccurrence(holiday.date, holiday.recurrence) 
    : new Date();
  
  // Always call hooks unconditionally
  const countdown = useCountdown(effectiveDate);
  
  const handleDelete = () => {
    if (id) {
      deleteHoliday(id);
      navigate('/holidays');
    }
  };
  
  // If holiday not found, redirect to list
  if (!holiday) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">Holiday not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">This event may have been deleted.</p>
          <button 
            onClick={() => navigate('/holidays')}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Back to Holidays
          </button>
        </div>
      </div>
    );
  }
  const { progress, lastDate, nextDate } = calculateProgress(holiday.date, holiday.recurrence);
  const image = categoryImages[holiday.category] || categoryImages.custom;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <MobileContainer>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 h-[45vh] w-full">
          <img 
            alt={holiday.name}
            className="h-full w-full object-cover opacity-60" 
            src={image}
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
              {effectiveDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                <span>Last: {lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>Next: {nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                      {holiday.description || 'No description available.'}
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
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatRecurrence(holiday.recurrence)}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                    <span className="material-symbols-outlined text-[20px]">category</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Category</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCategory(holiday.category)}</p>
                  </div>
                </div>
              </div>
              
              {/* Source */}
              {holiday.source && (
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
              )}
            </div>
            
            {/* Footer Actions */}
            <div className="mt-4 mb-8">
              <Button 
                variant="danger" 
                className="w-full" 
                icon="delete"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Holiday
              </Button>
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-600">
                Version 2.4.0 • ID: #{holiday.id}
              </p>
            </div>
          </div>
        </div>
      </MobileContainer>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-surface-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-3xl">delete_forever</span>
              </div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Delete "{holiday.name}"?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">
              This action cannot be undone. This celebration will be permanently removed from your list.
            </p>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-3.5 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl active:scale-[0.98] transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
