import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BIOMETRICS_ENABLED_KEY = '@florescer_biometrics_enabled';

/**
 * Checks if device hardware supports biometrics (Face ID, Fingerprint)
 */
export async function isBiometricsAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  } catch {
    return false;
  }
}

/**
 * Checks if user has turned on biometric protection in settings
 */
export async function isBiometricLockEnabled(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

/**
 * Toggles biometric lock on/off
 */
export async function setBiometricLockEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
}

/**
 * Prompts user for Face ID / Fingerprint authentication
 */
export async function promptBiometricAuth(
  promptMessage: string = 'Autentique-se para abrir o Florescer'
): Promise<boolean> {
  if (Platform.OS === 'web') return true;

  try {
    const available = await isBiometricsAvailable();
    if (!available) return true;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch {
    return true;
  }
}
