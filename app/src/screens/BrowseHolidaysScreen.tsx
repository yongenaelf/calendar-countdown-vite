import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MobileContainer, IconButton, Button } from '../components';
import { useHolidays } from '../context';
import { 
  fetchAvailableCountries, 
  fetchPublicHolidays, 
  getCountryFlag, 
  detectUserCountry,
  getHolidayIcon,
  getRandomHolidayColor,
  type NagerCountry
} from '../services/holidayApi';

const currentYear = new Date().getFullYear();

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

type AccentColor = 'orange' | 'pink' | 'yellow';

interface CountryItemProps {
  flag: string;
  name: string;
  countryCode: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  accentColor: AccentColor;
}

// SWR fetcher for holidays
const holidayFetcher = (countryCode: string) => fetchPublicHolidays(currentYear, countryCode);

function CountryItem({ flag, name, countryCode, checked = false, onChange, accentColor }: CountryItemProps) {
  const colors = accentColors[accentColor];
  const itemRef = useRef<HTMLLabelElement>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Use IntersectionObserver to trigger fetch only when item is in viewport
  useEffect(() => {
    if (shouldFetch) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => observer.disconnect();
  }, [shouldFetch]);
  
  // Fetch holidays only when triggered
  const { data } = useSWR(
    shouldFetch ? countryCode : null,
    holidayFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );
  
  const holidayCount = data?.length ?? null;
  const isLoading = shouldFetch && !data;
  
  return (
    <label ref={itemRef} className={`group relative flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-surface-dark border-2 border-white/60 dark:border-white/5 hover:border-joy-yellow/50 dark:hover:border-white/10 transition-all duration-300 ${colors.border} ${colors.bg} has-[:checked]:shadow-lg ${colors.shadow} cursor-pointer overflow-hidden transform hover:-translate-y-1`}>
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
          {isLoading ? (
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ) : holidayCount !== null ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
              {holidayCount} Holidays
            </p>
          ) : null}
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

interface CountryWithFlag extends NagerCountry {
  flag: string;
}

// Row types for the virtual list
type ListRow = 
  | { type: 'suggested-header' }
  | { type: 'all-header'; count: number; isSearch: boolean }
  | { type: 'country'; country: CountryWithFlag; index: number }
  | { type: 'empty-search' };

export function BrowseHolidaysScreen() {
  const navigate = useNavigate();
  const { addHoliday } = useHolidays();
  const [selectedTab, setSelectedTab] = useState<'countries' | 'religions'>('countries');
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Fetch countries using SWR
  const { data: countriesData, isLoading: isLoadingCountries, error: countriesError } = useSWR(
    'countries',
    fetchAvailableCountries,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  
  // Detect user country
  const { data: userCountryCode } = useSWR(
    'userCountry',
    detectUserCountry,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  
  // Transform countries with flags
  const countries: CountryWithFlag[] = useMemo(() => {
    if (!countriesData) return [];
    return countriesData.map(c => ({
      ...c,
      flag: getCountryFlag(c.countryCode),
    }));
  }, [countriesData]);
  
  // Pre-select user's country when detected
  useEffect(() => {
    if (userCountryCode && countriesData?.some(c => c.countryCode === userCountryCode)) {
      setSelectedCountries(prev => {
        if (prev.size === 0) {
          return new Set([userCountryCode]);
        }
        return prev;
      });
    }
  }, [userCountryCode, countriesData]);

  const toggleCountry = (countryCode: string, checked: boolean) => {
    setSelectedCountries(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(countryCode);
      } else {
        next.delete(countryCode);
      }
      return next;
    });
  };

  // Sort countries: user's country first, then alphabetically
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      if (userCountryCode) {
        if (a.countryCode === userCountryCode) return -1;
        if (b.countryCode === userCountryCode) return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [countries, userCountryCode]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return sortedCountries;
    const query = searchQuery.toLowerCase();
    return sortedCountries.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.countryCode.toLowerCase().includes(query)
    );
  }, [sortedCountries, searchQuery]);

  // Get suggested countries (user's country + popular ones)
  const suggestedCountries = useMemo(() => {
    const suggested: CountryWithFlag[] = [];
    
    if (userCountryCode) {
      const userCountry = countries.find(c => c.countryCode === userCountryCode);
      if (userCountry) suggested.push(userCountry);
    }
    
    const popularCodes = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN'];
    for (const code of popularCodes) {
      if (suggested.length >= 3) break;
      if (code === userCountryCode) continue;
      const country = countries.find(c => c.countryCode === code);
      if (country) suggested.push(country);
    }
    
    return suggested.slice(0, 3);
  }, [countries, userCountryCode]);

  // Filter for "All Countries" (exclude suggested ones)
  const allCountries = useMemo(() => {
    const suggestedCodes = new Set(suggestedCountries.map(c => c.countryCode));
    return filteredCountries.filter(c => !suggestedCodes.has(c.countryCode));
  }, [filteredCountries, suggestedCountries]);

  // Build rows for virtual list
  const rows: ListRow[] = useMemo(() => {
    const result: ListRow[] = [];
    
    // Add suggested section (only if not searching)
    if (suggestedCountries.length > 0 && !searchQuery) {
      result.push({ type: 'suggested-header' });
      suggestedCountries.forEach((country, index) => {
        result.push({ type: 'country', country, index });
      });
    }
    
    // Add all countries header
    result.push({ 
      type: 'all-header', 
      count: allCountries.length,
      isSearch: !!searchQuery 
    });
    
    // Add all countries or empty state
    if (allCountries.length === 0 && searchQuery) {
      result.push({ type: 'empty-search' });
    } else {
      allCountries.forEach((country, index) => {
        result.push({ type: 'country', country, index });
      });
    }
    
    return result;
  }, [suggestedCountries, allCountries, searchQuery]);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (row.type === 'suggested-header' || row.type === 'all-header') return 48;
      if (row.type === 'empty-search') return 120;
      return 94; // Country item height
    },
    overscan: 3,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Handle import
  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      for (const countryCode of selectedCountries) {
        const holidays = await fetchPublicHolidays(currentYear, countryCode);
        const country = countries.find(c => c.countryCode === countryCode);
        
        for (const holiday of holidays) {
          addHoliday({
            name: holiday.name,
            date: new Date(holiday.date),
            icon: getHolidayIcon(holiday.types),
            category: 'celebration',
            color: getRandomHolidayColor(),
            description: holiday.localName !== holiday.name ? `Local name: ${holiday.localName}` : undefined,
            recurrence: 'yearly',
            source: country?.name || countryCode,
          });
        }
      }
      
      navigate('/holidays');
    } catch (err) {
      console.error('Error importing holidays:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const getAccentColor = (index: number): AccentColor => {
    return ['orange', 'pink', 'yellow'][index % 3] as AccentColor;
  };

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
                placeholder="Search for a country..."
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl bg-white/60 dark:bg-surface-dark focus:bg-white dark:focus:bg-surface-dark-elevated border-2 border-transparent focus:border-joy-pink/30 dark:focus:border-primary/30 focus:ring-4 focus:ring-joy-pink/10 dark:focus:ring-primary/10 h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-11 pr-4 text-base font-medium leading-normal text-slate-800 dark:text-white transition-all shadow-sm dark:shadow-none"
              />
            </label>
          </div>
        </header>
        
        {/* Main content */}
        <main 
          ref={parentRef}
          className="flex-1 overflow-y-auto pb-32 px-4 pt-2 no-scrollbar"
          style={{ height: 'calc(100vh - 220px)' }}
        >
          {/* Error state */}
          {countriesError && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">Failed to load countries. Please try again.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 w-full text-center text-sm text-red-500 font-semibold"
              >
                Tap to retry
              </button>
            </div>
          )}
          
          {/* Loading state */}
          {isLoadingCountries ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="size-12 rounded-full border-4 border-joy-orange/30 border-t-joy-orange animate-spin" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Loading countries...</p>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.type === 'suggested-header' && (
                      <div className="py-2 bg-gradient-to-b from-white/0 via-white/90 dark:via-background-dark/90 to-transparent pb-4 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 px-2">
                          <span className="material-symbols-outlined text-joy-yellow dark:text-joy-yellow text-lg">star</span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {userCountryCode ? 'Suggested for you' : 'Popular choices'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {row.type === 'all-header' && (
                      <div className="py-2 mt-4 bg-gradient-to-b from-white/0 via-white/90 dark:via-background-dark/90 to-transparent pb-4 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 px-2">
                          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">public</span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {row.isSearch ? `Search results (${row.count})` : `All Countries (${row.count})`}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {row.type === 'empty-search' && (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">search_off</span>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No countries found</p>
                      </div>
                    )}
                    
                    {row.type === 'country' && (
                      <div className="pb-3">
                        <CountryItem
                          flag={row.country.flag}
                          name={row.country.name}
                          countryCode={row.country.countryCode}
                          checked={selectedCountries.has(row.country.countryCode)}
                          onChange={(checked) => toggleCountry(row.country.countryCode, checked)}
                          accentColor={getAccentColor(row.index)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
        
      </MobileContainer>
      
      {/* Footer CTA - Outside MobileContainer for proper fixed positioning */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-4 pt-6 bg-gradient-to-t from-white dark:from-background-dark via-white/95 dark:via-background-dark/95 to-transparent">
        <Button 
          className="w-full" 
          size="md" 
          icon={isImporting ? undefined : "celebration"}
          disabled={selectedCountries.size === 0 || isImporting}
          onClick={handleImport}
        >
          {isImporting ? (
            <span className="flex items-center gap-2">
              <span className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Importing...
            </span>
          ) : (
            `Import Holidays (${selectedCountries.size} countries)`
          )}
        </Button>
      </div>
    </div>
  );
}
