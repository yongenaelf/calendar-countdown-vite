import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MobileContainer, IconButton, Button } from '../components';
import { useHolidays, useTelegram } from '../context';
import { registerCountdownNotification } from '../services/notificationService';
import { 
  fetchAvailableCountries, 
  fetchPublicHolidays, 
  getCountryFlag, 
  detectUserCountry,
  getHolidayIcon,
  getRandomHolidayColor,
  type NagerCountry,
  type NagerPublicHoliday
} from '../services/holidayApi';
import { publicHolidaysByCountry, type PublicHolidayTemplate } from '../data';

const currentYear = new Date().getFullYear();

/**
 * Look up holiday details from our local data
 * This provides rich descriptions for holidays we have information about
 */
function getHolidayDetails(
  countryCode: string, 
  holidayName: string, 
  localName: string
): PublicHolidayTemplate | null {
  const countryData = publicHolidaysByCountry[countryCode];
  if (!countryData) return null;

  const normalizedName = holidayName.toLowerCase();
  const normalizedLocalName = localName.toLowerCase();
  
  // Score-based matching to find the best match
  let bestMatch: PublicHolidayTemplate | null = null;
  let bestScore = 0;
  
  for (const template of countryData.holidays) {
    const templateName = template.name.toLowerCase();
    const templateBaseName = templateName.replace(/\s*\(day \d+\)/i, '').trim();
    let score = 0;
    
    // Exact match gets highest score
    if (templateName === normalizedName || templateName === normalizedLocalName) {
      score = 100;
    }
    // Base name exact match (e.g., "chinese new year" matches "Chinese New Year (Day 1)")
    else if (templateBaseName === normalizedName || templateBaseName === normalizedLocalName) {
      score = 90;
    }
    // Check if the holiday name contains the template base name
    else if (normalizedName.includes(templateBaseName) && templateBaseName.length > 5) {
      // Give higher score for longer matches to avoid "new year" matching everything
      score = 50 + templateBaseName.length;
    }
    // Check common variations with specific matching
    else {
      const variations: Record<string, string[]> = {
        "new year's day": ["new year's day"], // Be strict - only exact match
        "chinese new year": ["chinese new year", "lunar new year", "spring festival", "农历新年", "春节"],
        "hari raya puasa": ["hari raya puasa", "eid al-fitr", "eid ul-fitr", "hari raya aidilfitri"],
        "hari raya haji": ["hari raya haji", "eid al-adha", "eid ul-adha", "hari raya aidiladha"],
        "vesak day": ["vesak day", "vesak", "buddha day", "卫塞节"],
        "deepavali": ["deepavali", "diwali", "festival of lights", "屠妖节"],
        "christmas day": ["christmas day", "christmas"],
        "good friday": ["good friday"],
        "labour day": ["labour day", "labor day", "may day"],
        "national day": ["national day"],
      };
      
      for (const [key, aliases] of Object.entries(variations)) {
        if (templateBaseName.includes(key)) {
          for (const alias of aliases) {
            if (normalizedName === alias || normalizedLocalName === alias) {
              score = 80; // Exact alias match
              break;
            }
            if (normalizedName.includes(alias) || normalizedLocalName.includes(alias)) {
              // Only match if it's a substantial part of the name
              if (alias.length > 8 || normalizedName.length < alias.length + 10) {
                score = Math.max(score, 60 + alias.length);
              }
            }
          }
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }
  
  // Only return a match if we have reasonable confidence
  return bestScore >= 50 ? bestMatch : null;
}

/**
 * Get the best description for a holiday
 */
function getHolidayDescription(
  countryCode: string,
  holiday: NagerPublicHoliday
): string | undefined {
  // First, try to get rich description from our local data
  const localDetails = getHolidayDetails(countryCode, holiday.name, holiday.localName);
  if (localDetails) {
    return localDetails.description;
  }
  
  // Fall back to showing local name if different
  if (holiday.localName !== holiday.name) {
    return `Local name: ${holiday.localName}`;
  }
  
  return undefined;
}

const accentColors = {
  orange: {
    border: 'has-[:checked]:border-joy-orange dark:has-[:checked]:border-joy-orange/50',
    bg: 'has-[:checked]:bg-gradient-to-br has-[:checked]:from-orange-50 has-[:checked]:to-yellow-50 dark:has-[:checked]:from-joy-orange/10 dark:has-[:checked]:to-yellow-500/10',
    shadow: 'has-[:checked]:shadow-joy-orange/20 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-orange peer-checked:border-joy-orange',
    checkboxActive: 'bg-joy-orange border-joy-orange',
    hover: 'group-hover:text-joy-orange',
  },
  pink: {
    border: 'has-[:checked]:border-joy-pink dark:has-[:checked]:border-joy-pink/50',
    bg: 'has-[:checked]:bg-pink-50 dark:has-[:checked]:bg-joy-pink/10',
    shadow: 'has-[:checked]:shadow-joy-pink/20 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-pink peer-checked:border-joy-pink',
    checkboxActive: 'bg-joy-pink border-joy-pink',
    hover: 'group-hover:text-joy-pink',
  },
  yellow: {
    border: 'has-[:checked]:border-joy-yellow dark:has-[:checked]:border-joy-yellow/50',
    bg: 'has-[:checked]:bg-yellow-50 dark:has-[:checked]:bg-joy-yellow/10',
    shadow: 'has-[:checked]:shadow-joy-yellow/30 dark:has-[:checked]:shadow-none',
    checkbox: 'peer-checked:bg-joy-yellow peer-checked:border-joy-yellow',
    checkboxActive: 'bg-joy-yellow border-joy-yellow',
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
        <div className={`size-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-white transition-all duration-300 shadow-sm dark:shadow-none peer-checked:scale-110 ${checked ? colors.checkboxActive : 'bg-white dark:bg-surface-dark'}`}>
          <span className={`material-symbols-outlined text-xl font-bold transition-all ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>check</span>
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
  const { addHoliday, clearAllHolidays } = useHolidays();
  const { user, initData, isTelegram } = useTelegram();
  const [selectedTab, setSelectedTab] = useState<'countries' | 'religions'>('countries');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
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
      dedupingInterval: 86400000, // 24 hours - matches localStorage cache
      refreshInterval: 0,
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
      setSelectedCountry(prev => prev === null ? userCountryCode : prev);
    }
  }, [userCountryCode, countriesData]);

  const selectCountry = (countryCode: string, checked: boolean) => {
    // Single selection: if checked, set as selected; if unchecked, deselect
    setSelectedCountry(checked ? countryCode : null);
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

  // Get suggested country (user's current country only)
  const suggestedCountry = useMemo(() => {
    if (!userCountryCode) return null;
    return countries.find(c => c.countryCode === userCountryCode) || null;
  }, [countries, userCountryCode]);

  // Filter for "All Countries" (exclude suggested country)
  const allCountries = useMemo(() => {
    if (!suggestedCountry) return filteredCountries;
    return filteredCountries.filter(c => c.countryCode !== suggestedCountry.countryCode);
  }, [filteredCountries, suggestedCountry]);

  // Build rows for virtual list
  const rows: ListRow[] = useMemo(() => {
    const result: ListRow[] = [];
    
    // Add suggested section (only if not searching and user country detected)
    if (suggestedCountry && !searchQuery) {
      result.push({ type: 'suggested-header' });
      result.push({ type: 'country', country: suggestedCountry, index: 0 });
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
  }, [suggestedCountry, allCountries, searchQuery]);

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

  // Handle import - replaces existing holidays with the selected country's holidays
  const handleImport = async () => {
    if (!selectedCountry) return;
    
    setIsImporting(true);
    
    try {
      const holidays = await fetchPublicHolidays(currentYear, selectedCountry);
      const country = countries.find(c => c.countryCode === selectedCountry);
      
      // Clear existing holidays first
      clearAllHolidays();
      
      const addedHolidays = [];
      const now = new Date();
      
      for (const holiday of holidays) {
        // Try to get rich details from our local data
        const localDetails = getHolidayDetails(selectedCountry, holiday.name, holiday.localName);
        const holidayDate = new Date(holiday.date);
        const icon = localDetails?.icon || getHolidayIcon(holiday.types);
        
        const newHoliday = addHoliday({
          name: holiday.name,
          date: holidayDate,
          // Use local data icon/color if available, otherwise use defaults
          icon,
          category: localDetails?.category || 'celebration',
          color: localDetails?.color || getRandomHolidayColor(),
          // Use rich description from local data if available
          description: getHolidayDescription(selectedCountry, holiday),
          recurrence: 'none', // Don't auto-recur as some holidays (e.g., Chinese New Year, Easter) don't fall on the same date every year
          source: country?.name || selectedCountry,
        });
        
        // Track future holidays for notification
        if (holidayDate >= now) {
          addedHolidays.push({ ...newHoliday, icon });
        }
      }
      
      // Register notification for the next upcoming holiday
      if (isTelegram && user && addedHolidays.length > 0) {
        // Sort by date and get the first upcoming holiday
        addedHolidays.sort((a, b) => a.date.getTime() - b.date.getTime());
        const nextHoliday = addedHolidays[0];
        
        try {
          await registerCountdownNotification({
            userId: user.id,
            holidayId: nextHoliday.id,
            name: nextHoliday.name,
            date: nextHoliday.date,
            icon: nextHoliday.icon,
            reminderOption: '1_day', // Remind 1 day before the next holiday
            initData,
          });
          console.log('[BrowseHolidaysScreen] Import notification sent');
        } catch (error) {
          console.error('[BrowseHolidaysScreen] Failed to send import notification:', error);
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
                            Suggested for you
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
                          checked={selectedCountry === row.country.countryCode}
                          onChange={(checked) => selectCountry(row.country.countryCode, checked)}
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
          disabled={!selectedCountry || isImporting}
          onClick={handleImport}
        >
          {isImporting ? (
            <span className="flex items-center gap-2">
              <span className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Importing...
            </span>
          ) : (
            'Replace Holidays'
          )}
        </Button>
      </div>
    </div>
  );
}
