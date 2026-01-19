export type ReminderOption = 'none' | 'on_day' | '1_day' | '3_days' | '1_week' | '2_weeks';

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  icon: string;
  category: 'celebration' | 'travel' | 'birthday' | 'custom';
  description?: string;
  recurrence?: 'none' | 'yearly' | 'monthly' | 'weekly';
  source?: string;
  color: 'emerald' | 'sky' | 'indigo' | 'teal' | 'pink' | 'orange';
  reminderOption?: ReminderOption; // Reminder setting for this event
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
