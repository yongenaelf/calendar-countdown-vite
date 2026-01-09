import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton, Button } from '../components';

interface CountryItemProps {
  flag: string;
  name: string;
  holidayCount: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  accentColor: 'orange' | 'pink' | 'yellow';
}

const accentColors = {
  orange: {
    border: 'has-[:checked]:border-joy-orange dark:has-[:checked]:border-joy-orange/50',
    bg: 'has-[:checked]:bg-gradient-to-br has-[:checked]:from-orange-50 has-[:checked]:to-yellow-50 dark:has-[:checked]:from-joy-orange/10 dark:has-[:checked]:to-yellow-500/10',
    shadow: 'has-[:checked]:shadow-joy-orange/20 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-orange peer-checked:border-joy-orange',
    hover: 'group-hover:text-joy-orange',
  },
  pink: {
    border: 'has-[:checked]:border-joy-pink dark:has-[:checked]:border-joy-pink/50',
    bg: 'has-[:checked]:bg-pink-50 dark:has-[:checked]:bg-joy-pink/10',
    shadow: 'has-[:checked]:shadow-joy-pink/20 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-pink peer-checked:border-joy-pink',
    hover: 'group-hover:text-joy-pink',
  },
  yellow: {
    border: 'has-[:checked]:border-joy-yellow dark:has-[:checked]:border-joy-yellow/50',
    bg: 'has-[:checked]:bg-yellow-50 dark:has-[:checked]:bg-joy-yellow/10',
    shadow: 'has-[:checked]:shadow-joy-yellow/30 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-yellow peer-checked:border-joy-yellow',
    hover: 'group-hover:text-joy-yellow',
  },
};

function CountryItem({ flag, name, holidayCount, checked = false, onChange, accentColor }: CountryItemProps) {
  const colors = accentColors[accentColor];
  
  return (
    <label className={`group relative flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-surface-dark border-2 border-white/60 dark:border-white/5 hover:border-joy-yellow/50 dark:hover:border-white/10 transition-all duration-300 ${colors.border} ${colors.bg} has-[:checked]:shadow-lg ${colors.shadow} cursor-pointer overflow-hidden transform hover:-translate-y-1`}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <div className="relative shrink-0">
        <div className="flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/10 shrink-0 size-14 text-3xl shadow-sm dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-slate-100 dark:border-white/10">
          {flag}
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center z-10">
        <p className={`text-slate-800 dark:text-white text-lg font-bold leading-tight ${colors.hover} transition-colors`}>{name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="material-symbols-outlined text-[16px] text-joy-pink dark:text-primary">calendar_month</span>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">{holidayCount} Holidays</p>
        </div>
      </div>
      <div className="shrink-0 z-10">
        <div className={`size-8 rounded-full border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark flex items-center justify-center text-white ${colors.checkbox} peer-checked:scale-110 transition-all duration-300 shadow-sm dark:shadow-none`}>
          <span className="material-symbols-outlined text-xl font-bold opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all">check</span>
        </div>
      </div>
    </label>
  );
}

const countries = [
  { flag: '🇺🇸', name: 'United States', count: 11 },
  { flag: '🇬🇧', name: 'United Kingdom', count: 8 },
  { flag: '🇨🇦', name: 'Canada', count: 13 },
  { flag: '🇦🇺', name: 'Australia', count: 10 },
  { flag: '🇯🇵', name: 'Japan', count: 16 },
  { flag: '🇩🇪', name: 'Germany', count: 14 },
  { flag: '🇫🇷', name: 'France', count: 11 },
  { flag: '🇮🇳', name: 'India', count: 21 },
  { flag: '🇧🇷', name: 'Brazil', count: 12 },
  { flag: '🇲🇽', name: 'Mexico', count: 11 },
];

export function BrowseHolidaysScreen() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'countries' | 'religions'>('countries');
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(['Canada']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCountry = (name: string, checked: boolean) => {
    setSelectedCountries(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(name);
      } else {
        next.delete(name);
      }
      return next;
    });
  };

  const totalHolidays = countries
    .filter(c => selectedCountries.has(c.name))
    .reduce((sum, c) => sum + c.count, 0);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-relax-blue via-relax-green to-relax-teal dark:from-background-dark dark:via-background-dark dark:to-background-dark min-h-screen">
      <MobileContainer className="bg-white/40 dark:bg-background-dark backdrop-blur-md border-x border-white/40 dark:border-white/5">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/95 backdrop-blur-xl border-b border-white/50 dark:border-white/5 transition-all shadow-sm dark:shadow-none">
          <div className="flex items-center p-4 justify-between">
            <IconButton 
              icon="arrow_back_ios_new" 
              onClick={() => navigate(-1)}
              className="bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-joy-orange"
            />
            <div className="text-center">
              <h2 className="text-slate-800 dark:text-white text-lg font-extrabold leading-tight tracking-tight">Add Holidays</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-joy-orange to-joy-pink dark:from-primary dark:to-primary-light">Select & Celebrate</p>
            </div>
            <div className="size-10 flex items-center justify-center text-joy-pink dark:text-primary bg-pink-50 dark:bg-primary/10 rounded-full">
              <span className="material-symbols-outlined animate-bounce-slight text-2xl">celebration</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="px-4 pb-4">
            <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-slate-100/80 dark:bg-surface-dark p-1.5 shadow-inner dark:shadow-none backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5">
              <label className={`relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-2 transition-all text-sm font-bold leading-normal group ${selectedTab === 'countries' ? 'bg-white dark:bg-surface-dark-elevated shadow-sm text-joy-orange dark:text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className="z-10 flex items-center gap-2 transition-transform group-active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                  Countries
                </span>
                <input 
                  type="radio" 
                  name="category-selector"
                  checked={selectedTab === 'countries'}
                  onChange={() => setSelectedTab('countries')}
                  className="peer invisible w-0 absolute"
                />
              </label>
              <label className={`relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-2 transition-all text-sm font-bold leading-normal group ${selectedTab === 'religions' ? 'bg-white dark:bg-surface-dark-elevated shadow-sm text-joy-pink dark:text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                <span className="z-10 flex items-center gap-2 transition-transform group-active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">diversity_3</span>
                  Religions
                </span>
                <input 
                  type="radio" 
                  name="category-selector"
                  checked={selectedTab === 'religions'}
                  onChange={() => setSelectedTab('religions')}
                  className="peer invisible w-0 absolute"
                />
              </label>
            </div>
          </div>
          
          {/* Search */}
          <div className="px-4 pb-4">
            <label className="flex flex-col h-12 w-full group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-focus-within:text-joy-pink dark:group-focus-within:text-primary transition-colors duration-300">search</span>
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place or faith..."
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl bg-white/60 dark:bg-surface-dark focus:bg-white dark:focus:bg-surface-dark-elevated border-2 border-transparent focus:border-joy-pink/30 dark:focus:border-primary/30 focus:ring-4 focus:ring-joy-pink/10 dark:focus:ring-primary/10 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-11 pr-4 text-base font-medium leading-normal text-slate-800 dark:text-white transition-all shadow-sm dark:shadow-none"
              />
            </label>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-32 px-4 pt-2 no-scrollbar">
          <div className="flex flex-col gap-3">
            {/* Suggested */}
            <div className="py-2 sticky top-0 z-10 bg-gradient-to-b from-white/0 via-white/90 dark:via-background-dark/90 to-transparent pb-4 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 px-2">
                <span className="material-symbols-outlined text-joy-yellow dark:text-joy-yellow text-lg">star</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suggested for you</span>
              </div>
            </div>
            
            {filteredCountries.slice(0, 3).map((country, i) => (
              <CountryItem
                key={country.name}
                flag={country.flag}
                name={country.name}
                holidayCount={country.count}
                checked={selectedCountries.has(country.name)}
                onChange={(checked) => toggleCountry(country.name, checked)}
                accentColor={['orange', 'pink', 'yellow'][i % 3] as 'orange' | 'pink' | 'yellow'}
              />
            ))}
            
            {/* All countries */}
            <div className="py-2 mt-4 sticky top-0 z-10 bg-gradient-to-b from-white/0 via-white/90 dark:via-background-dark/90 to-transparent pb-4 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 px-2">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">public</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">All Countries</span>
              </div>
            </div>
            
            {filteredCountries.slice(3).map((country, i) => (
              <CountryItem
                key={country.name}
                flag={country.flag}
                name={country.name}
                holidayCount={country.count}
                checked={selectedCountries.has(country.name)}
                onChange={(checked) => toggleCountry(country.name, checked)}
                accentColor={['orange', 'pink', 'yellow'][i % 3] as 'orange' | 'pink' | 'yellow'}
              />
            ))}
          </div>
        </main>
        
        {/* Footer CTA */}
        <div className="absolute bottom-0 w-full z-30 p-4 pt-4 bg-gradient-to-t from-white dark:from-background-dark via-white/80 dark:via-background-dark/80 to-transparent backdrop-blur-sm">
          <Button 
            className="w-full" 
            size="md" 
            icon="celebration"
            disabled={selectedCountries.size === 0}
          >
            Import {totalHolidays} Holidays
          </Button>
        </div>
      </MobileContainer>
    </div>
  );
}
