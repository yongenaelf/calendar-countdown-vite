import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton } from '../components';

interface ToggleItemProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function ToggleItem({ icon, iconBg, iconColor, title, subtitle, checked = false, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 justify-between border-b border-gray-50 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center rounded-2xl ${iconBg} shrink-0 w-12 h-12`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-base font-semibold leading-normal line-clamp-1 text-slate-800 dark:text-gray-100">{title}</p>
          <p className="text-slate-400 dark:text-gray-500 text-sm font-normal leading-normal line-clamp-1">{subtitle}</p>
        </div>
      </div>
      <div className="shrink-0">
        <label className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 transition-colors duration-300 ${checked ? 'justify-end bg-joy-orange' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <div className="h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-all"></div>
          <input 
            type="checkbox" 
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            className="invisible absolute"
          />
        </label>
      </div>
    </div>
  );
}

interface ListItemProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

function ListItem({ icon, iconBg, iconColor, title, subtitle, onClick }: ListItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-5 py-4 justify-between border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center rounded-2xl ${iconBg} shrink-0 w-12 h-12`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-base font-semibold leading-normal line-clamp-1 text-slate-800 dark:text-gray-100 group-hover:text-joy-orange transition-colors">{title}</p>
          <p className="text-slate-400 dark:text-gray-500 text-sm font-normal leading-normal line-clamp-1">{subtitle}</p>
        </div>
      </div>
      <span className="material-symbols-outlined text-slate-300 dark:text-gray-600 group-hover:text-joy-orange transition-colors">chevron_right</span>
    </button>
  );
}

export function ImportHolidaysScreen() {
  const navigate = useNavigate();
  const [iosCalendar, setIosCalendar] = useState(true);
  const [googleCalendar, setGoogleCalendar] = useState(false);
  const [androidCalendar, setAndroidCalendar] = useState(false);

  return (
    <div className="bg-sky-50 dark:bg-background-dark min-h-screen">
      <MobileContainer className="bg-sky-50 dark:bg-background-dark">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-sky-50/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-teal-900/5 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between px-4 py-3">
            <IconButton 
              icon="arrow_back_ios_new" 
              onClick={() => navigate(-1)}
              className="bg-transparent hover:bg-teal-100/50 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-300"
            />
            <h1 className="text-lg font-bold tracking-tight text-center flex-1 mr-8 text-slate-800 dark:text-white">Import Holidays</h1>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 space-y-8 overflow-y-auto no-scrollbar">
          {/* Hero */}
          <div className="text-center px-4 mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4 text-joy-orange shadow-sm ring-4 ring-white dark:ring-gray-800">
              <span className="material-symbols-outlined text-4xl">celebration</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get the Party Started!</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Import your holidays to fill up your countdown calendar instantly and let the joy begin.</p>
          </div>
          
          {/* Sync Calendars */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-4">Sync Calendars</h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-teal-900/5 dark:border-gray-800/50">
              <ToggleItem 
                icon="calendar_month"
                iconBg="bg-blue-50 dark:bg-blue-900/20"
                iconColor="text-blue-500 dark:text-blue-400"
                title="iOS Calendar"
                subtitle="Local Apple calendars"
                checked={iosCalendar}
                onChange={setIosCalendar}
              />
              <ToggleItem 
                icon="event"
                iconBg="bg-pink-50 dark:bg-pink-900/20"
                iconColor="text-joy-pink"
                title="Google Calendar"
                subtitle="Sync Google events"
                checked={googleCalendar}
                onChange={setGoogleCalendar}
              />
              <ToggleItem 
                icon="android"
                iconBg="bg-green-50 dark:bg-green-900/20"
                iconColor="text-green-500"
                title="Android Calendar"
                subtitle="From connected device"
                checked={androidCalendar}
                onChange={setAndroidCalendar}
              />
            </div>
            <p className="mt-3 ml-4 text-xs text-slate-400 dark:text-gray-500 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-joy-orange">sync</span>
              Auto-syncs daily for fresh countdowns.
            </p>
          </div>
          
          {/* Import Files */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-4">Import Files</h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-teal-900/5 dark:border-gray-800/50">
              <ListItem 
                icon="upload_file"
                iconBg="bg-indigo-50 dark:bg-indigo-500/20"
                iconColor="text-indigo-400"
                title="Upload .ICS File"
                subtitle="Standard iCal format"
              />
              <ListItem 
                icon="table_view"
                iconBg="bg-teal-50 dark:bg-teal-500/20"
                iconColor="text-teal-400"
                title="Upload .CSV File"
                subtitle="Spreadsheet data"
              />
            </div>
          </div>
          
          {/* Quick Add */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-4">Quick Add</h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-teal-900/5 dark:border-gray-800/50">
              <ListItem 
                icon="public"
                iconBg="bg-yellow-50 dark:bg-yellow-500/20"
                iconColor="text-yellow-500 dark:text-yellow-400"
                title="Holiday Library"
                subtitle="Browse by country or religion"
                onClick={() => navigate('/browse')}
              />
            </div>
          </div>
          
          {/* Privacy note */}
          <div className="flex flex-col items-center justify-center mt-4 px-8 text-center space-y-3 pb-8 opacity-70">
            <span className="material-symbols-outlined text-2xl text-teal-200 dark:text-gray-600">verified_user</span>
            <p className="text-xs text-slate-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
              Your privacy is our top priority. All imports are processed securely directly on your device.
            </p>
          </div>
        </main>
      </MobileContainer>
    </div>
  );
}
