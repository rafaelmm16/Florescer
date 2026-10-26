import {
  getTodayDateString,
  getYesterdayDateString,
  isStreakAlive,
  calculateCompletionUpdate,
  processDailyReset,
} from '../streak';
import { Routine } from '../../types/routine';

describe('Streak and Daily Cycle Engine', () => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  it('correctly calculates streak increment when completing consecutive days', () => {
    const routine: Routine = {
      id: '1',
      name: 'Beber Água',
      days: [0, 1, 2, 3, 4, 5, 6],
      goal: 3,
      progress: 3,
      isCompleted: true,
      streak: 4,
      bestStreak: 4,
      lastCompletedDate: yesterday,
      completedDates: [yesterday],
    };

    const update = calculateCompletionUpdate(routine);
    expect(update.streak).toBe(5);
    expect(update.bestStreak).toBe(5);
    expect(update.lastCompletedDate).toBe(today);
    expect(update.completedDates).toContain(today);
  });

  it('keeps streak alive when checking consecutive yesterday completion', () => {
    expect(isStreakAlive(yesterday, [0, 1, 2, 3, 4, 5, 6])).toBe(true);
    expect(isStreakAlive(today, [0, 1, 2, 3, 4, 5, 6])).toBe(true);
  });

  it('resets progress to 0 for a new day while preserving streak if alive', () => {
    const routine: Routine = {
      id: '2',
      name: 'Meditar',
      days: [0, 1, 2, 3, 4, 5, 6],
      goal: 1,
      progress: 1,
      isCompleted: true,
      streak: 3,
      bestStreak: 3,
      lastCompletedDate: yesterday,
      completedDates: [yesterday],
    };

    const [resetRoutine] = processDailyReset([routine]);
    expect(resetRoutine.progress).toBe(0);
    expect(resetRoutine.isCompleted).toBe(false);
    expect(resetRoutine.streak).toBe(3); // Streak preserved!
  });

  it('resets streak to 0 if a scheduled day was skipped in the past', () => {
    const twoWeeksAgo = '2026-01-01';
    const routine: Routine = {
      id: '3',
      name: 'Exercício',
      days: [0, 1, 2, 3, 4, 5, 6],
      goal: 1,
      progress: 1,
      isCompleted: true,
      streak: 10,
      bestStreak: 10,
      lastCompletedDate: twoWeeksAgo,
      completedDates: [twoWeeksAgo],
    };

    const [resetRoutine] = processDailyReset([routine]);
    expect(resetRoutine.streak).toBe(0); // Streak broken!
    expect(resetRoutine.bestStreak).toBe(10); // Record retained!
  });
});
