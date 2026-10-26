export interface Routine {
  id: string;
  name: string;
  days: number[];
  goal: number;
  progress: number;
  isCompleted: boolean;
  streak: number;
  bestStreak: number;
  lastCompletedDate?: string | null;
  completedDates?: string[];
  category?: string;
  color?: string;
  icon?: string;
  reminderTime?: string | null;
  notificationId?: string | null;
  isPaused?: boolean;
  notes?: { id: string; date: string; text: string }[];
}