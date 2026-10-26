import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '../types/routine';
import { syncRoutinesToDatabase, fetchRoutinesFromDatabase } from '../services/database';
import { processDailyReset } from './streak';
import { HABIT_CATEGORIES } from '../constants/categories';

const ROUTINES_KEY = '@routines';

// Busca todas as rotinas com ciclo diário processado
export const getRoutines = async (): Promise<Routine[]> => {
  try {
    let rawList: Routine[] = [];
    const jsonValue = await AsyncStorage.getItem(ROUTINES_KEY);
    if (jsonValue != null) {
      rawList = JSON.parse(jsonValue);
    } else {
      // Try restoring from MongoDB Atlas if local is empty
      const remote = await fetchRoutinesFromDatabase();
      if (remote && remote.length > 0) {
        rawList = remote;
      }
    }

    if (rawList.length > 0) {
      const processed = processDailyReset(rawList);
      // Persist processed state if changed
      await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(processed));
      return processed;
    }

    return [];
  } catch (e) {
    console.error('Failed to fetch routines.', e);
    return [];
  }
};

// Salva todas as rotinas
export const saveRoutines = async (routines: Routine[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(routines);
    await AsyncStorage.setItem(ROUTINES_KEY, jsonValue);
    // Background sync to MongoDB Atlas
    syncRoutinesToDatabase(routines).catch(() => {});
  } catch (e) {
    console.error('Failed to save routines.', e);
  }
};

// Adiciona uma nova rotina
export const addRoutine = async (data: {
  name: string;
  days: number[];
  goal: number;
  category?: string;
  color?: string;
  icon?: string;
  reminderTime?: string | null;
  notificationId?: string | null;
}): Promise<Routine> => {
  const routines = await getRoutines();

  const newRoutine: Routine = {
    id: Date.now().toString(),
    name: data.name,
    days: data.days,
    goal: data.goal,
    progress: 0,
    isCompleted: false,
    streak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    completedDates: [],
    category: data.category || HABIT_CATEGORIES[0].id,
    color: data.color || HABIT_CATEGORIES[0].color,
    icon: data.icon || HABIT_CATEGORIES[0].icon,
    reminderTime: data.reminderTime || null,
    notificationId: data.notificationId || null,
  };

  routines.push(newRoutine);
  await saveRoutines(routines);
  return newRoutine;
};

// Atualiza uma rotina existente
export const updateRoutine = async (updatedRoutine: Routine): Promise<void> => {
  let routines = await getRoutines();
  routines = routines.map((routine) => (routine.id === updatedRoutine.id ? updatedRoutine : routine));
  await saveRoutines(routines);
};

// Deleta uma rotina permanentemente
export const deleteRoutine = async (id: string): Promise<void> => {
  let routines = await getRoutines();
  routines = routines.filter((routine) => routine.id !== id);
  await saveRoutines(routines);
};