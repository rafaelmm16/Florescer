import { Routine } from '../types/routine';
import { HABIT_CATEGORIES } from '../constants/categories';

/**
 * Returns formatted date string: YYYY-MM-DD
 */
export function getFormattedDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return getFormattedDate(new Date());
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getFormattedDate(d);
}

/**
 * Calculates days between two YYYY-MM-DD strings
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if the streak was broken based on scheduled days between last completion and today
 */
export function isStreakAlive(
  lastCompletedDate: string | null | undefined,
  scheduledDays: number[]
): boolean {
  if (!lastCompletedDate) return false;

  const todayStr = getTodayDateString();
  if (lastCompletedDate === todayStr) return true;

  const yesterdayStr = getYesterdayDateString();
  if (lastCompletedDate === yesterdayStr) return true;

  // If completed earlier than yesterday, check if any scheduled day was missed
  const lastDate = new Date(lastCompletedDate + 'T00:00:00');
  const today = new Date(todayStr + 'T00:00:00');

  // Check each day between last completion and yesterday
  const checkDate = new Date(lastDate);
  checkDate.setDate(checkDate.getDate() + 1);

  while (checkDate < today) {
    const dayOfWeek = checkDate.getDay();
    if (scheduledDays.includes(dayOfWeek)) {
      // Missed a scheduled day!
      return false;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return true;
}

/**
 * Processes daily resets for routines when a new day starts.
 */
export function processDailyReset(routines: Routine[]): Routine[] {
  const today = getTodayDateString();

  return routines.map((r) => {
    // 1. Ensure backward compatibility defaults
    const category = r.category || HABIT_CATEGORIES[0].id;
    const color = r.color || HABIT_CATEGORIES[0].color;
    const icon = r.icon || HABIT_CATEGORIES[0].icon;
    const completedDates = Array.isArray(r.completedDates) ? [...r.completedDates] : [];
    let currentStreak = typeof r.streak === 'number' ? r.streak : 0;
    const bestStreak = typeof r.bestStreak === 'number' ? r.bestStreak : currentStreak;

    // 2. Check if already interacted today
    const wasCompletedToday = r.lastCompletedDate === today;

    if (wasCompletedToday) {
      // Still today, keep progress and status as-is
      return {
        ...r,
        category,
        color,
        icon,
        streak: currentStreak,
        bestStreak,
        completedDates,
      };
    }

    // 3. If today is a new day:
    // Check if the streak is still alive from past days
    if (currentStreak > 0 && !isStreakAlive(r.lastCompletedDate, r.days || [0, 1, 2, 3, 4, 5, 6])) {
      currentStreak = 0;
    }

    // Reset daily progress for the new day
    return {
      ...r,
      progress: 0,
      isCompleted: false,
      streak: currentStreak,
      bestStreak,
      category,
      color,
      icon,
      completedDates,
    };
  });
}

/**
 * Updates streak and history when a routine reaches completion
 */
export function calculateCompletionUpdate(routine: Routine): {
  streak: number;
  bestStreak: number;
  lastCompletedDate: string;
  completedDates: string[];
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const completedDates = Array.isArray(routine.completedDates) ? [...routine.completedDates] : [];
  if (!completedDates.includes(today)) {
    completedDates.push(today);
  }

  // If already completed today before, don't increment streak again
  if (routine.lastCompletedDate === today) {
    return {
      streak: routine.streak || 1,
      bestStreak: Math.max(routine.bestStreak || 1, routine.streak || 1),
      lastCompletedDate: today,
      completedDates,
    };
  }

  let newStreak = 1;
  if (routine.lastCompletedDate === yesterday) {
    newStreak = (routine.streak || 0) + 1;
  } else if (isStreakAlive(routine.lastCompletedDate, routine.days || [0, 1, 2, 3, 4, 5, 6])) {
    newStreak = (routine.streak || 0) + 1;
  }

  const bestStreak = Math.max(routine.bestStreak || 0, newStreak);

  return {
    streak: newStreak,
    bestStreak,
    lastCompletedDate: today,
    completedDates,
  };
}
