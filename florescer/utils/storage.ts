// contador-de-habitos/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '../types/routine';

const ROUTINES_KEY = '@routines';

// Busca todas as rotinas
export const getRoutines = async (): Promise<Routine[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ROUTINES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
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
  } catch (e) {
    console.error('Failed to save routines.', e);
  }
};

// Adiciona uma nova rotina (CORRIGIDO)
export const addRoutine = async (data: { name: string, days: number[], goal: number }): Promise<void> => {
  const routines = await getRoutines();
  
  // Cria o objeto completo da nova rotina com todos os campos necessários
  const newRoutine: Routine = {
    id: Date.now().toString(),
    name: data.name,
    days: data.days,
    goal: data.goal,
    progress: 0,
    isCompleted: false,
    isDeleted: false,
  };

  routines.push(newRoutine);
  await saveRoutines(routines);
};

// Atualiza uma rotina existente
export const updateRoutine = async (updatedRoutine: Routine): Promise<void> => {
  let routines = await getRoutines();
  routines = routines.map(routine => (routine.id === updatedRoutine.id ? updatedRoutine : routine));
  await saveRoutines(routines);
};