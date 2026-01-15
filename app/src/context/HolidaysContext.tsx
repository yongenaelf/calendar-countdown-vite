import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Holiday } from '../types/holiday';

const HOLIDAYS_KEY = 'calendar-countdown-holidays';

// Default holidays
const defaultHolidays: Holiday[] = [
  {
    id: '1',
    name: 'Christmas',
    date: new Date('2025-12-25'),
    icon: 'forest',
    category: 'religious',
    color: 'emerald',
    description: 'Christmas is an annual festival commemorating the birth of Jesus Christ.',
    recurrence: 'yearly',
    source: 'US Holidays',
  },
  {
    id: '2',
    name: 'Trip to Bali',
    date: new Date('2026-01-15T10:00:00'),
    icon: 'flight_takeoff',
    category: 'travel',
    color: 'sky',
    description: 'Annual vacation to Bali, Indonesia.',
  },
  {
    id: '3',
    name: "New Year's Eve",
    date: new Date('2025-12-31'),
    icon: 'celebration',
    category: 'celebration',
    color: 'indigo',
    recurrence: 'yearly',
  },
  {
    id: '4',
    name: "Mom's Birthday",
    date: new Date('2026-02-20'),
    icon: 'cake',
    category: 'birthday',
    color: 'pink',
    recurrence: 'yearly',
  },
];

interface HolidaysContextType {
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  getHoliday: (id: string) => Holiday | undefined;
}

const HolidaysContext = createContext<HolidaysContextType | undefined>(undefined);

// Helper to serialize holidays (convert Date objects to ISO strings)
function serializeHolidays(holidays: Holiday[]): string {
  return JSON.stringify(holidays.map(h => ({
    ...h,
    date: h.date instanceof Date ? h.date.toISOString() : h.date,
  })));
}

// Helper to deserialize holidays (convert ISO strings back to Date objects)
function deserializeHolidays(json: string): Holiday[] {
  const parsed = JSON.parse(json);
  return parsed.map((h: Holiday & { date: string }) => ({
    ...h,
    date: new Date(h.date),
  }));
}

export function HolidaysProvider({ children }: { children: ReactNode }) {
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    try {
      const stored = localStorage.getItem(HOLIDAYS_KEY);
      if (stored) {
        return deserializeHolidays(stored);
      }
    } catch (e) {
      console.error('Failed to load holidays from localStorage:', e);
    }
    return defaultHolidays;
  });

  // Persist holidays to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HOLIDAYS_KEY, serializeHolidays(holidays));
    } catch (e) {
      console.error('Failed to save holidays to localStorage:', e);
    }
  }, [holidays]);

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holiday,
      id: Date.now().toString(),
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const updateHoliday = (id: string, updates: Partial<Holiday>) => {
    setHolidays(prev => 
      prev.map(h => h.id === id ? { ...h, ...updates } : h)
    );
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const getHoliday = (id: string) => {
    return holidays.find(h => h.id === id);
  };

  return (
    <HolidaysContext.Provider value={{ holidays, addHoliday, updateHoliday, deleteHoliday, getHoliday }}>
      {children}
    </HolidaysContext.Provider>
  );
}

export function useHolidays() {
  const context = useContext(HolidaysContext);
  if (context === undefined) {
    throw new Error('useHolidays must be used within a HolidaysProvider');
  }
  return context;
}
