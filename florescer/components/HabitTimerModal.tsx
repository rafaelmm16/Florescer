import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { triggerLightHaptic, triggerSuccessHaptic } from '../utils/haptics';
import { playZenChime } from '../utils/sound';

interface HabitTimerModalProps {
  visible: boolean;
  routine: Routine | null;
  onClose: () => void;
  onTimerComplete: (routine: Routine) => void;
}

const PRESET_MINUTES = [5, 10, 15, 25];

export default function HabitTimerModal({
  visible,
  routine,
  onClose,
  onTimerComplete,
}: HabitTimerModalProps) {
  const { theme, isDark } = useTheme();

  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setSecondsRemaining(selectedMinutes * 60);
      setIsRunning(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [visible, selectedMinutes]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleFinish = async () => {
    triggerSuccessHaptic();
    await playZenChime();
    if (routine) {
      onTimerComplete(routine);
    }
  };

  const handleTogglePlay = () => {
    triggerLightHaptic();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    triggerLightHaptic();
    setIsRunning(false);
    setSecondsRemaining(selectedMinutes * 60);
  };

  const handleSelectPreset = (mins: number) => {
    if (isRunning) return;
    triggerLightHaptic();
    setSelectedMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const minutesPart = Math.floor(secondsRemaining / 60);
  const secondsPart = secondsRemaining % 60;
  const formattedTime = `${String(minutesPart).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`;

  const totalSeconds = selectedMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;

  const activeFocusBorder = isDark ? '#38BDF8' : '#0F172A';
  const buttonBg = isDark ? '#38BDF8' : '#0F172A';
  const buttonTextColor = isDark ? '#090D14' : '#FFFFFF';

  if (!routine) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <GlassCard borderRadius={24} style={styles.modalCard}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                  Timer de Foco ⏱️
                </Text>
                <Text style={[styles.routineName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                  {routine.name}
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Presets Row */}
            <View style={styles.presetsRow}>
              {PRESET_MINUTES.map((mins) => {
                const isSelected = selectedMinutes === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => handleSelectPreset(mins)}
                    disabled={isRunning}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(56, 189, 248, 0.12)'
                            : 'rgba(15, 23, 42, 0.06)'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.04)'
                          : '#F8FAFC',
                        borderColor: isSelected
                          ? activeFocusBorder
                          : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        {
                          color: isSelected ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {mins}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Large Minimalist Timer Display */}
            <View style={styles.timerCircle}>
              <Text style={[styles.timerDigits, { color: theme.colors.onSurface }]}>
                {formattedTime}
              </Text>
              <Text style={[styles.timerStatus, { color: theme.colors.onSurfaceVariant }]}>
                {isRunning ? 'Em andamento...' : secondsRemaining === 0 ? 'Concluído! ✨' : 'Pronto para iniciar'}
              </Text>
            </View>

            {/* Thin Progress line */}
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9' },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(progressRatio * 100)}%`,
                    backgroundColor: isDark ? '#38BDF8' : '#0F172A',
                  },
                ]}
              />
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleReset}
                style={[
                  styles.secondaryBtn,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  },
                ]}
              >
                <Ionicons name="refresh" size={18} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTogglePlay}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: buttonBg },
                ]}
              >
                <Ionicons
                  name={isRunning ? 'pause' : 'play'}
                  size={20}
                  color={buttonTextColor}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.primaryBtnText, { color: buttonTextColor }]}>
                  {isRunning ? 'Pausar' : 'Iniciar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
  },
  modalContent: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  routineName: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 13,
  },
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  timerDigits: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  timerStatus: {
    fontSize: 13,
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
    marginVertical: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
