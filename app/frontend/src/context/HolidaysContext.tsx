import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Holiday } from '../types/holiday';

const HOLIDAYS_KEY = 'calendar-countdown-holidays';

// Default holidays (empty - user starts fresh)
const defaultHolidays: Holiday[] = [];

interface HolidaysContextType {
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => Holiday;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  getHoliday: (id: string) => Holiday | undefined;
  clearAllHolidays: () => void;
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

  const addHoliday = (holiday: Omit<Holiday, 'id'>): Holiday => {
    const newHoliday: Holiday = {
      ...holiday,
      id: crypto.randomUUID(),
    };
    setHolidays(prev => [...prev, newHoliday]);
    return newHoliday;
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

  const clearAllHolidays = () => {
    setHolidays([]);
  };

  return (
    <HolidaysContext.Provider value={{ holidays, addHoliday, updateHoliday, deleteHoliday, getHoliday, clearAllHolidays }}>
      {children}
    </HolidaysContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHolidays() {
  const context = useContext(HolidaysContext);
  if (context === undefined) {
    throw new Error('useHolidays must be used within a HolidaysProvider');
  }
  return context;
}
