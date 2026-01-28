// Nager.Date API service
// https://date.nager.at/

export interface NagerCountry {
  countryCode: string;
  name: string;
}

export interface NagerPublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  AD: '🇦🇩', AE: '🇦🇪', AF: '🇦🇫', AG: '🇦🇬', AI: '🇦🇮', AL: '🇦🇱', AM: '🇦🇲', AO: '🇦🇴',
  AR: '🇦🇷', AS: '🇦🇸', AT: '🇦🇹', AU: '🇦🇺', AW: '🇦🇼', AX: '🇦🇽', AZ: '🇦🇿', BA: '🇧🇦',
  BB: '🇧🇧', BD: '🇧🇩', BE: '🇧🇪', BF: '🇧🇫', BG: '🇧🇬', BH: '🇧🇭', BI: '🇧🇮', BJ: '🇧🇯',
  BL: '🇧🇱', BM: '🇧🇲', BN: '🇧🇳', BO: '🇧🇴', BQ: '🇧🇶', BR: '🇧🇷', BS: '🇧🇸', BT: '🇧🇹',
  BW: '🇧🇼', BY: '🇧🇾', BZ: '🇧🇿', CA: '🇨🇦', CC: '🇨🇨', CD: '🇨🇩', CF: '🇨🇫', CG: '🇨🇬',
  CH: '🇨🇭', CI: '🇨🇮', CK: '🇨🇰', CL: '🇨🇱', CM: '🇨🇲', CN: '🇨🇳', CO: '🇨🇴', CR: '🇨🇷',
  CU: '🇨🇺', CV: '🇨🇻', CW: '🇨🇼', CX: '🇨🇽', CY: '🇨🇾', CZ: '🇨🇿', DE: '🇩🇪', DJ: '🇩🇯',
  DK: '🇩🇰', DM: '🇩🇲', DO: '🇩🇴', DZ: '🇩🇿', EC: '🇪🇨', EE: '🇪🇪', EG: '🇪🇬', ER: '🇪🇷',
  ES: '🇪🇸', ET: '🇪🇹', FI: '🇫🇮', FJ: '🇫🇯', FK: '🇫🇰', FM: '🇫🇲', FO: '🇫🇴', FR: '🇫🇷',
  GA: '🇬🇦', GB: '🇬🇧', GD: '🇬🇩', GE: '🇬🇪', GF: '🇬🇫', GG: '🇬🇬', GH: '🇬🇭', GI: '🇬🇮',
  GL: '🇬🇱', GM: '🇬🇲', GN: '🇬🇳', GP: '🇬🇵', GQ: '🇬🇶', GR: '🇬🇷', GT: '🇬🇹', GU: '🇬🇺',
  GW: '🇬🇼', GY: '🇬🇾', HK: '🇭🇰', HN: '🇭🇳', HR: '🇭🇷', HT: '🇭🇹', HU: '🇭🇺', ID: '🇮🇩',
  IE: '🇮🇪', IL: '🇮🇱', IM: '🇮🇲', IN: '🇮🇳', IQ: '🇮🇶', IR: '🇮🇷', IS: '🇮🇸', IT: '🇮🇹',
  JE: '🇯🇪', JM: '🇯🇲', JO: '🇯🇴', JP: '🇯🇵', KE: '🇰🇪', KG: '🇰🇬', KH: '🇰🇭', KI: '🇰🇮',
  KM: '🇰🇲', KN: '🇰🇳', KP: '🇰🇵', KR: '🇰🇷', KW: '🇰🇼', KY: '🇰🇾', KZ: '🇰🇿', LA: '🇱🇦',
  LB: '🇱🇧', LC: '🇱🇨', LI: '🇱🇮', LK: '🇱🇰', LR: '🇱🇷', LS: '🇱🇸', LT: '🇱🇹', LU: '🇱🇺',
  LV: '🇱🇻', LY: '🇱🇾', MA: '🇲🇦', MC: '🇲🇨', MD: '🇲🇩', ME: '🇲🇪', MF: '🇲🇫', MG: '🇲🇬',
  MH: '🇲🇭', MK: '🇲🇰', ML: '🇲🇱', MM: '🇲🇲', MN: '🇲🇳', MO: '🇲🇴', MP: '🇲🇵', MQ: '🇲🇶',
  MR: '🇲🇷', MS: '🇲🇸', MT: '🇲🇹', MU: '🇲🇺', MV: '🇲🇻', MW: '🇲🇼', MX: '🇲🇽', MY: '🇲🇾',
  MZ: '🇲🇿', NA: '🇳🇦', NC: '🇳🇨', NE: '🇳🇪', NF: '🇳🇫', NG: '🇳🇬', NI: '🇳🇮', NL: '🇳🇱',
  NO: '🇳🇴', NP: '🇳🇵', NR: '🇳🇷', NU: '🇳🇺', NZ: '🇳🇿', OM: '🇴🇲', PA: '🇵🇦', PE: '🇵🇪',
  PF: '🇵🇫', PG: '🇵🇬', PH: '🇵🇭', PK: '🇵🇰', PL: '🇵🇱', PM: '🇵🇲', PN: '🇵🇳', PR: '🇵🇷',
  PT: '🇵🇹', PW: '🇵🇼', PY: '🇵🇾', QA: '🇶🇦', RE: '🇷🇪', RO: '🇷🇴', RS: '🇷🇸', RU: '🇷🇺',
  RW: '🇷🇼', SA: '🇸🇦', SB: '🇸🇧', SC: '🇸🇨', SD: '🇸🇩', SE: '🇸🇪', SG: '🇸🇬', SH: '🇸🇭',
  SI: '🇸🇮', SJ: '🇸🇯', SK: '🇸🇰', SL: '🇸🇱', SM: '🇸🇲', SN: '🇸🇳', SO: '🇸🇴', SR: '🇸🇷',
  SS: '🇸🇸', ST: '🇸🇹', SV: '🇸🇻', SX: '🇸🇽', SY: '🇸🇾', SZ: '🇸🇿', TC: '🇹🇨', TD: '🇹🇩',
  TG: '🇹🇬', TH: '🇹🇭', TJ: '🇹🇯', TK: '🇹🇰', TL: '🇹🇱', TM: '🇹🇲', TN: '🇹🇳', TO: '🇹🇴',
  TR: '🇹🇷', TT: '🇹🇹', TV: '🇹🇻', TW: '🇹🇼', TZ: '🇹🇿', UA: '🇺🇦', UG: '🇺🇬', US: '🇺🇸',
  UY: '🇺🇾', UZ: '🇺🇿', VA: '🇻🇦', VC: '🇻🇨', VE: '🇻🇪', VG: '🇻🇬', VI: '🇻🇮', VN: '🇻🇳',
  VU: '🇻🇺', WF: '🇼🇫', WS: '🇼🇸', YE: '🇾🇪', YT: '🇾🇹', ZA: '🇿🇦', ZM: '🇿🇲', ZW: '🇿🇼',
};

const BASE_URL = 'https://date.nager.at/api/v3';

/**
 * Fetch all available countries from Nager.Date API
 */
export async function fetchAvailableCountries(): Promise<NagerCountry[]> {
  const response = await fetch(`${BASE_URL}/AvailableCountries`);
  if (!response.ok) {
    throw new Error('Failed to fetch available countries');
  }
  return response.json();
}

/**
 * Fetch public holidays for a specific country and year
 */
export async function fetchPublicHolidays(year: number, countryCode: string): Promise<NagerPublicHoliday[]> {
  const response = await fetch(`${BASE_URL}/PublicHolidays/${year}/${countryCode}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch holidays for ${countryCode}`);
  }
  return response.json();
}

/**
 * Get flag emoji for a country code
 */
export function getCountryFlag(countryCode: string): string {
  return countryFlags[countryCode.toUpperCase()] || '🏳️';
}

const USER_COUNTRY_KEY = 'holiday-app-user-country';
const USER_COUNTRY_TIMESTAMP_KEY = 'holiday-app-user-country-timestamp';
const COUNTRY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

/**
 * Detect user's country using IP geolocation
 * Uses https://api.country.is/ - returns { ip: string, country: string }
 * Results are cached in localStorage for 24 hours to avoid rate limiting
 */
export async function detectUserCountry(): Promise<string | null> {
  try {
    // Check localStorage cache first
    const cachedCountry = localStorage.getItem(USER_COUNTRY_KEY);
    const cachedTimestamp = localStorage.getItem(USER_COUNTRY_TIMESTAMP_KEY);
    
    if (cachedCountry && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp, 10);
      if (age < COUNTRY_CACHE_DURATION) {
        return cachedCountry;
      }
    }
    
    // Fetch from API if cache is missing or expired
    const response = await fetch('https://api.country.is/');
    if (!response.ok) {
      // If rate limited, return cached value if available
      if (response.status === 429 && cachedCountry) {
        return cachedCountry;
      }
      return null;
    }
    const data = await response.json();
    const normalizedCode = (data.country as string).toUpperCase();
    
    // Cache the result
    localStorage.setItem(USER_COUNTRY_KEY, normalizedCode);
    localStorage.setItem(USER_COUNTRY_TIMESTAMP_KEY, Date.now().toString());
    
    return normalizedCode;
  } catch {
    // On error, return cached value if available
    const cachedCountry = localStorage.getItem(USER_COUNTRY_KEY);
    return cachedCountry || null;
  }
}

/**
 * Map holiday type to icon
 */
export function getHolidayIcon(types: string[]): string {
  if (types.includes('Public')) return 'celebration';
  if (types.includes('Bank')) return 'account_balance';
  if (types.includes('School')) return 'school';
  if (types.includes('Authorities')) return 'gavel';
  if (types.includes('Optional')) return 'event_available';
  if (types.includes('Observance')) return 'visibility';
  return 'calendar_month';
}

/**
 * Get a random color for holiday cards
 */
export function getRandomHolidayColor(): 'emerald' | 'sky' | 'indigo' | 'teal' | 'pink' | 'orange' {
  const colors: Array<'emerald' | 'sky' | 'indigo' | 'teal' | 'pink' | 'orange'> = [
    'emerald', 'sky', 'indigo', 'teal', 'pink', 'orange'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
