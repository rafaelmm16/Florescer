import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '../types/routine';
import { getRoutines, saveRoutines } from './storage';
import { USER_PROFILE_KEY, saveUserProfile } from '../services/database';

export interface BackupData {
  version: number;
  exportedAt: string;
  routines: Routine[];
  profile: any;
}

/**
 * Exports all local data as a formatted JSON string
 */
export async function exportAllData(): Promise<string> {
  const routines = await getRoutines();
  let profile = null;

  try {
    const rawProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (rawProfile) {
      profile = JSON.parse(rawProfile);
    }
  } catch {}

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    routines,
    profile,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Validates and restores backup JSON data
 */
export async function importBackupData(jsonStr: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonStr);

    if (!Array.isArray(data.routines)) {
      return { success: false, message: 'Arquivo inválido: nenhuma lista de rotinas encontrada.' };
    }

    // Save restored routines
    await saveRoutines(data.routines);

    // Save restored profile if present
    if (data.profile && typeof data.profile === 'object') {
      await saveUserProfile(data.profile);
    }

    return {
      success: true,
      message: `${data.routines.length} hábitos e dados de perfil restaurados com sucesso!`,
    };
  } catch (e: any) {
    return { success: false, message: `Erro ao importar: ${e.message || 'JSON inválido'}` };
  }
}
