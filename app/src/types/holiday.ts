export interface Holiday {
  id: string;
  name: string;
  date: Date;
  icon: string;
  category: 'celebration' | 'travel' | 'birthday' | 'religious' | 'custom';
  description?: string;
  recurrence?: 'none' | 'yearly' | 'monthly' | 'weekly';
  source?: string;
  color: 'emerald' | 'sky' | 'indigo' | 'teal' | 'pink' | 'orange';
  reminder?: boolean; // Whether a reminder is set for this event
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
