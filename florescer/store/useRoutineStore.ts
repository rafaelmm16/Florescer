import { create } from 'zustand';
import { Routine } from '../types/routine';
import { getRoutines, saveRoutines } from '../utils/storage';

interface RoutineStore {
  routines: Routine[];
  isLoading: boolean;
  loadRoutines: () => Promise<void>;
  addRoutine: (routine: Routine) => Promise<void>;
  updateRoutine: (routine: Routine) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  reorderRoutines: (routines: Routine[]) => Promise<void>;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: [],
  isLoading: true,
  
  loadRoutines: async () => {
    set({ isLoading: true });
    const routines = await getRoutines();
    set({ routines, isLoading: false });
  },

  addRoutine: async (routine) => {
    const newRoutines = [...get().routines, routine];
    set({ routines: newRoutines });
    await saveRoutines(newRoutines);
  },

  updateRoutine: async (updatedRoutine) => {
    const newRoutines = get().routines.map(r => 
      r.id === updatedRoutine.id ? updatedRoutine : r
    );
    set({ routines: newRoutines });
    await saveRoutines(newRoutines);
  },

  deleteRoutine: async (id) => {
    const newRoutines = get().routines.filter(r => r.id !== id);
    set({ routines: newRoutines });
    await saveRoutines(newRoutines);
  },

  reorderRoutines: async (reordered) => {
    set({ routines: reordered });
    await saveRoutines(reordered);
  }
}));
