import type { Holiday } from '../types/holiday';

/**
 * Public Holiday Template - used as a base for creating holiday entries
 * Date is provided separately since it can vary by year
 */
export interface PublicHolidayTemplate {
  name: string;
  description: string;
  icon: string;
  category: Holiday['category'];
  color: Holiday['color'];
  /** Whether the date is fixed (e.g., Dec 25) or movable (e.g., Easter) */
  dateType: 'fixed' | 'movable';
  /** For fixed dates: month (1-12) and day */
  fixedDate?: { month: number; day: number };
  /** For movable dates: a hint about when it typically falls */
  movableDateHint?: string;
}

export interface CountryHolidays {
  countryCode: string;
  countryName: string;
  flag: string;
  holidays: PublicHolidayTemplate[];
}

/**
 * Public holidays lookup by country
 * Currently includes: Singapore
 * Easy to extend with more countries
 */
export const publicHolidaysByCountry: Record<string, CountryHolidays> = {
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    flag: '🇸🇬',
    holidays: [
      {
        name: "New Year's Day",
        description: "New Year's Day marks the first day of the year in the Gregorian calendar. In Singapore, it is celebrated with fireworks displays at Marina Bay, countdown parties, and family gatherings. Many Singaporeans also take this opportunity to reflect on the past year and set resolutions for the year ahead.",
        icon: 'celebration',
        category: 'celebration',
        color: 'indigo',
        dateType: 'fixed',
        fixedDate: { month: 1, day: 1 },
      },
      {
        name: 'Chinese New Year (Day 1)',
        description: "Chinese New Year, also known as the Spring Festival or Lunar New Year, is the most important traditional Chinese holiday. It marks the beginning of a new year on the traditional Chinese calendar. Celebrations include family reunion dinners, giving of red packets (ang pow), lion and dragon dances, visiting relatives, and enjoying festive foods like pineapple tarts, bak kwa, and mandarin oranges.",
        icon: 'auto_awesome',
        category: 'celebration',
        color: 'orange',
        dateType: 'movable',
        movableDateHint: 'January or February (based on lunar calendar)',
      },
      {
        name: 'Chinese New Year (Day 2)',
        description: "The second day of Chinese New Year continues the festivities with family visits, especially to maternal grandparents. It is believed that married daughters return to their parents' home on this day. The celebrations continue with feasting, games, and the exchange of well-wishes for prosperity and good fortune in the new year.",
        icon: 'auto_awesome',
        category: 'celebration',
        color: 'orange',
        dateType: 'movable',
        movableDateHint: 'January or February (day after CNY Day 1)',
      },
      {
        name: 'Good Friday',
        description: "Good Friday is a Christian holiday commemorating the crucifixion of Jesus Christ and his death at Calvary. It is observed during Holy Week as part of the Paschal Triduum. In Singapore, many churches hold special services, and some Christians participate in the Way of the Cross procession. It is a day of fasting, prayer, and reflection for the Christian community.",
        icon: 'church',
        category: 'celebration',
        color: 'indigo',
        dateType: 'movable',
        movableDateHint: 'March or April (Friday before Easter Sunday)',
      },
      {
        name: 'Labour Day',
        description: "Labour Day, also known as May Day, is an annual holiday celebrating workers and the labour movement. In Singapore, the National Trades Union Congress (NTUC) typically organizes events to honor workers' contributions to the nation. It is a day to recognize workers' rights and achievements, and many Singaporeans enjoy a day off with family and friends.",
        icon: 'construction',
        category: 'celebration',
        color: 'teal',
        dateType: 'fixed',
        fixedDate: { month: 5, day: 1 },
      },
      {
        name: 'Vesak Day',
        description: "Vesak Day commemorates the birth, enlightenment, and death of Gautama Buddha, the founder of Buddhism. It is one of the most important days in the Buddhist calendar. In Singapore, Buddhists visit temples to pray, make offerings, and participate in rituals. Many temples are decorated with lights and flowers, and some organize vegetarian food distributions and the release of captive animals as acts of compassion.",
        icon: 'self_improvement',
        category: 'celebration',
        color: 'emerald',
        dateType: 'movable',
        movableDateHint: 'April or May (full moon day of Vesakha month)',
      },
      {
        name: 'Hari Raya Puasa',
        description: "Hari Raya Puasa, also known as Eid al-Fitr, marks the end of Ramadan, the Islamic holy month of fasting. Muslims celebrate with morning prayers at mosques, followed by visits to the graves of loved ones. The day is spent visiting family and friends, asking for forgiveness, and enjoying festive foods like ketupat, rendang, and kueh. The Malay community opens their homes to visitors of all races in the spirit of togetherness.",
        icon: 'mosque',
        category: 'celebration',
        color: 'emerald',
        dateType: 'movable',
        movableDateHint: 'Based on Islamic lunar calendar (after Ramadan)',
      },
      {
        name: 'National Day',
        description: "National Day celebrates Singapore's independence from Malaysia on 9 August 1965. It is marked by the National Day Parade (NDP) featuring military displays, cultural performances, and fireworks. Singaporeans display national flags, sing patriotic songs, and participate in community events. The day is a time to celebrate the nation's achievements and reflect on the Singapore spirit of unity and resilience.",
        icon: 'flag',
        category: 'celebration',
        color: 'pink',
        dateType: 'fixed',
        fixedDate: { month: 8, day: 9 },
      },
      {
        name: 'Hari Raya Haji',
        description: "Hari Raya Haji, also known as Eid al-Adha or the Festival of Sacrifice, commemorates Prophet Ibrahim's willingness to sacrifice his son as an act of obedience to God. Muslims attend special prayers at mosques and perform the Korban (animal sacrifice), distributing the meat to family, friends, and the needy. It is a time for reflection, charity, and strengthening bonds within the community.",
        icon: 'mosque',
        category: 'celebration',
        color: 'teal',
        dateType: 'movable',
        movableDateHint: 'Based on Islamic lunar calendar (10th day of Dhul Hijjah)',
      },
      {
        name: 'Deepavali',
        description: "Deepavali, also known as Diwali or the Festival of Lights, is one of the most important Hindu festivals. It symbolizes the victory of light over darkness and good over evil. In Singapore, Little India comes alive with colorful lights and decorations. Hindus clean their homes, light oil lamps (diyas), create kolam (rangoli) designs, wear new clothes, and exchange sweets. Families gather for prayers and festive meals.",
        icon: 'flare',
        category: 'celebration',
        color: 'orange',
        dateType: 'movable',
        movableDateHint: 'October or November (based on Hindu lunar calendar)',
      },
      {
        name: 'Christmas Day',
        description: "Christmas Day celebrates the birth of Jesus Christ and is one of the most widely celebrated holidays worldwide. In Singapore, Orchard Road transforms into a winter wonderland with spectacular light displays. Families gather for gift exchanges and festive meals. Many churches hold special services, and the holiday is embraced by Singaporeans of all backgrounds as a time for giving, celebration, and togetherness.",
        icon: 'forest',
        category: 'celebration',
        color: 'emerald',
        dateType: 'fixed',
        fixedDate: { month: 12, day: 25 },
      },
    ],
  },
};

/**
 * Get all countries available in the lookup
 */
export function getAvailableCountries(): { code: string; name: string; flag: string }[] {
  return Object.values(publicHolidaysByCountry).map(country => ({
    code: country.countryCode,
    name: country.countryName,
    flag: country.flag,
  }));
}

/**
 * Get holidays for a specific country
 */
export function getHolidaysForCountry(countryCode: string): PublicHolidayTemplate[] | null {
  const country = publicHolidaysByCountry[countryCode];
  return country ? country.holidays : null;
}

/**
 * Get a specific holiday by name and country
 */
export function getHolidayByName(countryCode: string, holidayName: string): PublicHolidayTemplate | null {
  const holidays = getHolidaysForCountry(countryCode);
  if (!holidays) return null;
  return holidays.find(h => h.name.toLowerCase() === holidayName.toLowerCase()) || null;
}

/**
 * Search holidays across all countries
 */
export function searchHolidays(query: string): { country: CountryHolidays; holiday: PublicHolidayTemplate }[] {
  const results: { country: CountryHolidays; holiday: PublicHolidayTemplate }[] = [];
  const lowerQuery = query.toLowerCase();

  Object.values(publicHolidaysByCountry).forEach(country => {
    country.holidays.forEach(holiday => {
      if (
        holiday.name.toLowerCase().includes(lowerQuery) ||
        holiday.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ country, holiday });
      }
    });
  });

  return results;
}

/**
 * Get holiday dates for a specific year
 * Note: For movable holidays, you would need to integrate with a calendar API
 * or implement date calculation logic for each type of movable holiday
 */
export function getHolidayDatesForYear(countryCode: string, year: number): { holiday: PublicHolidayTemplate; date: Date | null }[] {
  const holidays = getHolidaysForCountry(countryCode);
  if (!holidays) return [];

  return holidays.map(holiday => {
    if (holiday.dateType === 'fixed' && holiday.fixedDate) {
      return {
        holiday,
        date: new Date(year, holiday.fixedDate.month - 1, holiday.fixedDate.day),
      };
    }
    // For movable holidays, return null - these would need special calculation
    return { holiday, date: null };
  });
}

/**
 * Known dates for movable holidays (2024-2027)
 * This lookup table provides actual dates for holidays that vary by year
 */
export const movableHolidayDates: Record<string, Record<string, Record<number, { month: number; day: number }>>> = {
  SG: {
    'Chinese New Year (Day 1)': {
      2024: { month: 2, day: 10 },
      2025: { month: 1, day: 29 },
      2026: { month: 2, day: 17 },
      2027: { month: 2, day: 6 },
    },
    'Chinese New Year (Day 2)': {
      2024: { month: 2, day: 11 },
      2025: { month: 1, day: 30 },
      2026: { month: 2, day: 18 },
      2027: { month: 2, day: 7 },
    },
    'Good Friday': {
      2024: { month: 3, day: 29 },
      2025: { month: 4, day: 18 },
      2026: { month: 4, day: 3 },
      2027: { month: 3, day: 26 },
    },
    'Vesak Day': {
      2024: { month: 5, day: 22 },
      2025: { month: 5, day: 12 },
      2026: { month: 5, day: 31 },
      2027: { month: 5, day: 20 },
    },
    'Hari Raya Puasa': {
      2024: { month: 4, day: 10 },
      2025: { month: 3, day: 31 },
      2026: { month: 3, day: 20 },
      2027: { month: 3, day: 10 },
    },
    'Hari Raya Haji': {
      2024: { month: 6, day: 17 },
      2025: { month: 6, day: 7 },
      2026: { month: 5, day: 27 },
      2027: { month: 5, day: 17 },
    },
    'Deepavali': {
      2024: { month: 11, day: 1 },
      2025: { month: 10, day: 20 },
      2026: { month: 11, day: 8 },
      2027: { month: 10, day: 29 },
    },
  },
};

/**
 * Get the actual date for a movable holiday in a specific year
 */
export function getMovableHolidayDate(
  countryCode: string,
  holidayName: string,
  year: number
): Date | null {
  const countryDates = movableHolidayDates[countryCode];
  if (!countryDates) return null;

  const holidayDates = countryDates[holidayName];
  if (!holidayDates) return null;

  const dateInfo = holidayDates[year];
  if (!dateInfo) return null;

  return new Date(year, dateInfo.month - 1, dateInfo.day);
}

/**
 * Get all holidays with their actual dates for a specific country and year
 */
export function getHolidaysWithDates(
  countryCode: string,
  year: number
): { template: PublicHolidayTemplate; date: Date }[] {
  const holidays = getHolidaysForCountry(countryCode);
  if (!holidays) return [];

  const results: { template: PublicHolidayTemplate; date: Date }[] = [];

  holidays.forEach(holiday => {
    let date: Date | null = null;

    if (holiday.dateType === 'fixed' && holiday.fixedDate) {
      date = new Date(year, holiday.fixedDate.month - 1, holiday.fixedDate.day);
    } else if (holiday.dateType === 'movable') {
      date = getMovableHolidayDate(countryCode, holiday.name, year);
    }

    if (date) {
      results.push({ template: holiday, date });
    }
  });

  // Sort by date
  results.sort((a, b) => a.date.getTime() - b.date.getTime());

  return results;
}

/**
 * Convert a holiday template to a Holiday object
 */
export function templateToHoliday(
  template: PublicHolidayTemplate,
  date: Date,
  countryName: string
): Omit<Holiday, 'id'> {
  return {
    name: template.name,
    date,
    icon: template.icon,
    category: template.category,
    color: template.color,
    description: template.description,
    recurrence: 'yearly',
    source: `${countryName} Public Holidays`,
  };
}
