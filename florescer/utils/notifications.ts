import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notification behavior when app is in foreground
if (Platform.OS !== 'web') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldPresentBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {}
}

/**
 * Requests permission for local notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedules a daily reminder notification for a routine
 * @param routineId Unique routine ID
 * @param routineName Name of the routine
 * @param timeStr HH:mm format (e.g. "08:30")
 * @returns notificationId string or null
 */
export async function scheduleRoutineReminder(
  routineId: string,
  routineName: string,
  timeStr: string
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;

    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de Florescer 🌱',
        body: `Lembrete: "${routineName}" está esperando por você!`,
        data: { routineId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return id;
  } catch (e) {
    console.warn('Failed to schedule notification:', e);
    return null;
  }
}

/**
 * Cancels a previously scheduled notification
 */
export async function cancelRoutineReminder(notificationId?: string | null): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    console.warn('Failed to cancel notification:', e);
  }
}
