import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Pressable, Animated, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Routine } from '../types/routine';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';

interface RoutineItemProps {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onDelete: (id: string) => void;
  drag?: () => void;
  isActive?: boolean;
  isExpanded: boolean;
  onExpandToggle: () => void;
  index: number;
}

const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function RoutineItem({
  routine,
  onUpdate,
  onDelete,
  drag,
  isActive = false,
  isExpanded,
  onExpandToggle,
  index,
}: RoutineItemProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const scaleValue = useRef(new Animated.Value(1)).current;
  const progressRatio = Math.min(1, Math.max(0, routine.progress / (routine.goal || 1)));
  const progressAnim = useRef(new Animated.Value(progressRatio)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progressRatio,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [routine.progress, routine.goal]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSetCompleted = () => {
    const updatedRoutine = { ...routine, progress: routine.goal, isCompleted: true };
    onUpdate(updatedRoutine);
  };

  const handleEdit = () => {
    if (routine.isCompleted) return;
    router.push(`/routine/${routine.id}`);
  };

  const handleDeleteConfirmation = () => {
    Alert.alert(
      'Excluir Rotina',
      `Tem certeza que deseja excluir a rotina "${routine.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => onDelete(routine.id), style: 'destructive' },
      ]
    );
  };

  const handleIncrement = () => {
    if (routine.progress < routine.goal) {
      const newProgress = routine.progress + 1;
      const isNowCompleted = newProgress === routine.goal;
      onUpdate({ ...routine, progress: newProgress, isCompleted: isNowCompleted });
    }
  };

  const handleDecrement = () => {
    if (routine.progress > 0) {
      onUpdate({ ...routine, progress: routine.progress - 1 });
    }
  };

  const progressPercent = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isComplete = routine.isCompleted || routine.progress >= routine.goal;

  return (
    <Pressable
      onPress={onExpandToggle}
      onLongPress={!routine.isCompleted ? drag : undefined}
      disabled={isActive || routine.isCompleted}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <GlassCard
          borderRadius={24}
          style={[
            styles.cardContainer,
            isActive && styles.activeCard,
            isComplete && { borderColor: 'rgba(16, 185, 129, 0.45)' },
          ]}
        >
          <View style={styles.cardContent}>
            {/* Top row: Title and Progress pill */}
            <View style={styles.cardHeader}>
              <View style={styles.titleWrapper}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isComplete ? theme.colors.success : theme.colors.primary,
                      shadowColor: isComplete ? theme.colors.success : theme.colors.primary,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme.colors.onSurface,
                      textDecorationLine: routine.isCompleted ? 'line-through' : 'none',
                      opacity: routine.isCompleted ? 0.7 : 1,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {routine.name}
                </Text>
              </View>

              <LiquidGlassView
                effect="clear"
                colorScheme={isDark ? 'dark' : 'light'}
                tintColor={
                  isComplete
                    ? isDark
                      ? 'rgba(45, 212, 191, 0.25)'
                      : 'rgba(204, 251, 241, 0.85)'
                    : isDark
                    ? 'rgba(0, 242, 254, 0.14)'
                    : 'rgba(6, 182, 212, 0.12)'
                }
                style={[
                  styles.badge,
                  {
                    borderColor: isComplete
                      ? isDark
                        ? 'rgba(45, 212, 191, 0.45)'
                        : 'rgba(13, 148, 136, 0.35)'
                      : isDark
                      ? 'rgba(0, 242, 254, 0.22)'
                      : 'rgba(6, 182, 212, 0.20)',
                  },
                  !isLiquidGlassSupported && {
                    backgroundColor: isComplete
                      ? isDark
                        ? 'rgba(45, 212, 191, 0.22)'
                        : 'rgba(204, 251, 241, 0.85)'
                      : isDark
                      ? 'rgba(0, 242, 254, 0.10)'
                      : 'rgba(255, 255, 255, 0.70)',
                  },
                ]}
              >
                {isComplete && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={isDark ? '#2DD4BF' : '#0D9488'}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: isComplete
                        ? isDark
                          ? '#2DD4BF'
                          : '#0F766E'
                        : theme.colors.onSurface,
                    },
                  ]}
                >
                  {routine.progress} / {routine.goal}
                </Text>
              </LiquidGlassView>
            </View>

            {/* Glowing Liquid Progress Bar in Vibrant Turquoise */}
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.08)' : 'rgba(6, 182, 212, 0.08)' },
              ]}
            >
              <Animated.View style={[styles.progressBarFill, { width: progressPercent }]}>
                <LinearGradient
                  colors={
                    isComplete
                      ? ['#2DD4BF', '#14B8A6', '#059669']
                      : ['#00F2FE', '#06B6D4', '#0284C7']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>

            {/* Week days indicator chips */}
            {routine.days && routine.days.length > 0 && (
              <View style={styles.daysRow}>
                {routine.days.map((dayIdx) => (
                  <View
                    key={dayIdx}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.65)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(226, 232, 240, 0.8)',
                      },
                    ]}
                  >
                    <Text style={[styles.dayChipText, { color: theme.colors.onSurfaceVariant }]}>
                      {weekDayLabels[dayIdx]}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Expanded options toolbar */}
            {isExpanded && !routine.isCompleted && (
              <View
                style={[
                  styles.expandedToolbar,
                  {
                    borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                {/* Decrement Button */}
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={[
                    styles.toolBtn,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.65)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.8)',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={18} color={theme.colors.onSurface} />
                </TouchableOpacity>

                {/* Increment Button */}
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={[
                    styles.toolBtn,
                    {
                      backgroundColor: isDark ? 'rgba(0, 242, 254, 0.18)' : 'rgba(6, 182, 212, 0.12)',
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                {/* Complete Button */}
                <TouchableOpacity
                  onPress={handleSetCompleted}
                  style={[
                    styles.toolBtn,
                    styles.toolBtnComplete,
                    {
                      backgroundColor: theme.colors.secondary,
                      borderColor: theme.colors.secondary,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={handleEdit}
                  style={[
                    styles.toolBtn,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.65)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.8)',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={16} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={handleDeleteConfirmation}
                  style={[
                    styles.toolBtn,
                    {
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.08)',
                      borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.2)',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 7,
  },
  cardContainer: {
    width: '100%',
  },
  activeCard: {
    borderColor: '#34D399',
    transform: [{ scale: 1.02 }],
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.2,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px) saturate(180%)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.45)',
      } as any,
    }),
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  dayChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.2,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35)',
      } as any,
    }),
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandedToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  toolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.45)',
      } as any,
    }),
  },
  toolBtnComplete: {
    width: 52,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});