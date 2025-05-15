import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';

const STORAGE_KEY = 'habits_data';

export async function loadHabits(): Promise<{ habits: Habit[]; trash: Habit[] }> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return { habits: [], trash: [] };
}

export async function saveHabits(data: { habits: Habit[]; trash: Habit[] }) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}