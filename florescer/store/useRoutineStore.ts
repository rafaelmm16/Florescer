import { create } from 'zustand';
import { Routine } from '../types/routine';
import { getRoutines, saveRoutines } from '../utils/storage';
import { calculateCompletionUpdate } from '../utils/streak';
import { cancelRoutineReminder } from '../utils/notifications';

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
    const currentList = get().routines;
    const oldRoutine = currentList.find((r) => r.id === updatedRoutine.id);

    let finalRoutine = { ...updatedRoutine };

    // If routine was just completed (or reached goal)
    if (finalRoutine.isCompleted && (!oldRoutine || !oldRoutine.isCompleted)) {
      const streakInfo = calculateCompletionUpdate(finalRoutine);
      finalRoutine = {
        ...finalRoutine,
        ...streakInfo,
      };
    }

    const newRoutines = currentList.map((r) =>
      r.id === finalRoutine.id ? finalRoutine : r
    );

    set({ routines: newRoutines });
    await saveRoutines(newRoutines);
  },

  deleteRoutine: async (id) => {
    const toDelete = get().routines.find((r) => r.id === id);
    if (toDelete?.notificationId) {
      cancelRoutineReminder(toDelete.notificationId);
    }

    const newRoutines = get().routines.filter((r) => r.id !== id);
    set({ routines: newRoutines });
    await saveRoutines(newRoutines);
  },

  reorderRoutines: async (reordered) => {
    set({ routines: reordered });
    await saveRoutines(reordered);
  },
}));

