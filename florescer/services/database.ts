import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Routine } from '../types/routine';

export interface UserProfile {
  name: string;
  email?: string;
  bio?: string;
  imageUri?: string | null;
  isConfigured?: boolean;
}

export const USER_PROFILE_KEY = 'userProfile';
export const ONBOARDING_COMPLETED_KEY = '@florescer_onboarding_completed';

export function getApiBaseUrl(): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location) {
      return `http://${window.location.hostname}:3001/api`;
    }
    return 'http://localhost:3001/api';
  }
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3001/api`;
  }
  return 'http://localhost:3001/api';
}

/**
 * Checks connectivity to the backend and MongoDB Atlas
 */
export async function checkDatabaseHealth(): Promise<{ connected: boolean; cluster?: string; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${getApiBaseUrl()}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        connected: data.database === 'connected',
        cluster: data.cluster,
      };
    }
    return { connected: false, error: `HTTP ${res.status}` };
  } catch (error: any) {
    return { connected: false, error: error.message || 'Offline' };
  }
}

/**
 * Checks if the user has already configured their profile
 */
export async function isProfileConfigured(): Promise<boolean> {
  try {
    // 1. Check local flag first (fastest)
    const localFlag = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    if (localFlag === 'true') {
      return true;
    }

    // 2. Check local profile data
    const localProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (localProfile) {
      const parsed = JSON.parse(localProfile);
      if (parsed.name && parsed.name.trim() !== '') {
        await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
        return true;
      }
    }

    // 3. Try to check MongoDB Atlas in background
    const remote = await fetchProfileFromDatabase();
    if (remote && remote.isConfigured && remote.name) {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(remote));
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.email && p.email.trim() !== '') {
        headers['x-user-id'] = p.email.trim().toLowerCase();
      } else if (p.name && p.name.trim() !== '') {
        headers['x-user-id'] = p.name.trim().toLowerCase().replace(/\s+/g, '_');
      }
    }
  } catch {}
  return headers;
}

/**
 * Fetch profile from MongoDB Atlas
 */
export async function fetchProfileFromDatabase(): Promise<UserProfile | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const headers = await getAuthHeaders();
    const res = await fetch(`${getApiBaseUrl()}/profile`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.profile || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Saves profile locally and syncs to MongoDB Atlas
 */
export async function saveUserProfile(profile: UserProfile): Promise<{ success: boolean; syncedWithMongo: boolean }> {
  let syncedWithMongo = false;

  // 1. Always save to local storage immediately
  try {
    const dataToSave = {
      ...profile,
      isConfigured: true,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(dataToSave));
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (e) {
    console.error('Failed to save profile locally', e);
  }

  // 2. Sync to MongoDB Atlas
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const headers = await getAuthHeaders();
    if (profile.email) {
      headers['x-user-id'] = profile.email.trim().toLowerCase();
    }

    const res = await fetch(`${getApiBaseUrl()}/profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(profile),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      syncedWithMongo = true;
    }
  } catch (e) {
    console.warn('MongoDB Atlas sync deferred (offline or unreachable):', e);
  }

  return { success: true, syncedWithMongo };
}

/**
 * Sync routines to MongoDB Atlas
 */
export async function syncRoutinesToDatabase(routines: Routine[]): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const headers = await getAuthHeaders();
    const res = await fetch(`${getApiBaseUrl()}/routines`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ routines }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * Fetch routines from MongoDB Atlas
 */
export async function fetchRoutinesFromDatabase(): Promise<Routine[] | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers = await getAuthHeaders();
    const res = await fetch(`${getApiBaseUrl()}/routines`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data.routines) ? data.routines : null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

