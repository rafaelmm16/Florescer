import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SOUND_ENABLED_KEY = '@florescer_sound_enabled';

let audioContext: any = null;

function getWebAudioContext(): any {
  if (typeof window === 'undefined') return null;
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) {
    audioContext = new AudioCtx();
  }
  return audioContext;
}

/**
 * Checks if sound effects are enabled in user settings (default true)
 */
export async function isSoundEnabled(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export async function setSoundEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch {}
}

/**
 * Plays a tranquil, modern harmonic zen chime on goal completion
 */
export async function playZenChime(): Promise<void> {
  try {
    const enabled = await isSoundEnabled();
    if (!enabled) return;

    if (Platform.OS === 'web') {
      const ctx = getWebAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Harmonic chords: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), B5 (987.77Hz)
      const frequencies = [523.25, 659.25, 783.99, 987.77];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        // Gentle envelope: quick attack, smooth exponential decay
        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 1.3);
      });
    } else {
      // On mobile native, we can safely invoke expo-av or audio feedback
      try {
        const { Audio } = require('expo-av');
        // Configure audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
      } catch {}
    }
  } catch {}
}
