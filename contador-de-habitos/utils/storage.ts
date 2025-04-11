import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';

const HABITS_KEY = '@habits';

export const saveHabits = async (habits: Habit[]) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Erro ao salvar:', error);
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const json = await AsyncStorage.getItem(HABITS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Erro ao carregar:', error);
    return [];
  }
};