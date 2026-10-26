import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Pressable, Animated, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import GlassCard from './GlassCard';
import { triggerLightHaptic, triggerSuccessHaptic, triggerWarningHaptic } from '../utils/haptics';
import { getCategoryById } from '../constants/categories';

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

  const category = getCategoryById(routine.category);
  const routineColor = routine.color || category.color || (isDark ? '#38BDF8' : '#0F172A');
  const routineIcon = (routine.icon as any) || category.icon || 'sparkles-outline';

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
      toValue: 0.98,
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

  const handleToggleComplete = () => {
    if (routine.isCompleted) {
      triggerLightHaptic();
      onUpdate({ ...routine, progress: 0, isCompleted: false });
    } else {
      triggerSuccessHaptic();
      onUpdate({ ...routine, progress: routine.goal, isCompleted: true });
    }
  };

  const handleEdit = () => {
    triggerLightHaptic();
    if (routine.isCompleted) return;
    router.push(`/routine/${routine.id}`);
  };

  const handleDeleteConfirmation = () => {
    triggerWarningHaptic();
    Alert.alert(
      'Excluir Hábito',
      `Deseja realmente remover "${routine.name}"?`,
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
      if (isNowCompleted) {
        triggerSuccessHaptic();
      } else {
        triggerLightHaptic();
      }
      onUpdate({ ...routine, progress: newProgress, isCompleted: isNowCompleted });
    }
  };

  const handleDecrement = () => {
    if (routine.progress > 0) {
      triggerLightHaptic();
      onUpdate({ ...routine, progress: routine.progress - 1, isCompleted: false });
    }
  };

  const progressPercent = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isComplete = routine.isCompleted || routine.progress >= routine.goal;
  const currentStreak = routine.streak || 0;

  return (
    <Pressable
      onPress={() => {
        triggerLightHaptic();
        onExpandToggle();
      }}
      onLongPress={!routine.isCompleted ? drag : undefined}
      disabled={isActive || routine.isCompleted}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <GlassCard
          borderRadius={18}
          style={[
            styles.cardContainer,
            isActive && styles.activeCard,
            isComplete && {
              borderColor: isDark ? 'rgba(52, 211, 153, 0.25)' : '#BBF7D0',
            },
          ]}
        >
          <View style={styles.cardContent}>
            {/* Main Habit Row */}
            <View style={styles.cardHeader}>
              {/* Category / Icon Box */}
              <TouchableOpacity
                onPress={handleToggleComplete}
                activeOpacity={0.7}
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isComplete
                      ? isDark
                        ? 'rgba(52, 211, 153, 0.15)'
                        : '#ECFDF5'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : '#F1F5F9',
                    borderColor: isComplete
                      ? isDark
                        ? 'rgba(52, 211, 153, 0.35)'
                        : '#A7F3D0'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E2E8F0',
                  },
                ]}
              >
                <Ionicons
                  name={isComplete ? 'checkmark' : routineIcon}
                  size={19}
                  color={isComplete ? (isDark ? '#34D399' : '#059669') : routineColor}
                />
              </TouchableOpacity>

              {/* Title & Metadata */}
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: isComplete ? theme.colors.onSurfaceVariant : theme.colors.onSurface,
                      textDecorationLine: isComplete ? 'line-through' : 'none',
                      opacity: isComplete ? 0.75 : 1,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {routine.name}
                </Text>

                <View style={styles.metaRow}>
                  {/* Category Name */}
                  <Text style={[styles.categoryLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {category.name}
                  </Text>

                  {/* Streak */}
                  {currentStreak > 0 && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={[styles.streakText, { color: isDark ? '#FB923C' : '#EA580C' }]}>
                        🔥 {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
                      </Text>
                    </View>
                  )}

                  {/* Reminder */}
                  {routine.reminderTime && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={[styles.reminderText, { color: theme.colors.onSurfaceVariant }]}>
                        {routine.reminderTime}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Progress Count or Check Toggle Button */}
              <TouchableOpacity
                onPress={routine.goal > 1 && !isComplete ? handleIncrement : handleToggleComplete}
                activeOpacity={0.7}
                style={[
                  styles.countButton,
                  {
                    backgroundColor: isComplete
                      ? isDark
                        ? 'rgba(52, 211, 153, 0.12)'
                        : '#ECFDF5'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : '#F1F5F9',
                    borderColor: isComplete
                      ? isDark
                        ? 'rgba(52, 211, 153, 0.3)'
                        : '#A7F3D0'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : '#E2E8F0',
                  },
                ]}
              >
                {routine.goal === 1 ? (
                  <Ionicons
                    name={isComplete ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isComplete ? (isDark ? '#34D399' : '#059669') : theme.colors.onSurfaceVariant}
                  />
                ) : (
                  <Text
                    style={[
                      styles.countText,
                      {
                        color: isComplete
                          ? isDark
                            ? '#34D399'
                            : '#059669'
                          : theme.colors.onSurface,
                      },
                    ]}
                  >
                    {routine.progress}/{routine.goal}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Minimalist Progress Track (Subtle 3px line) */}
            <View
              style={[
                styles.progressBarTrack,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9' },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressPercent,
                    backgroundColor: isComplete ? (isDark ? '#34D399' : '#10B981') : routineColor,
                  },
                ]}
              />
            </View>

            {/* Expanded Toolbar for Quick Actions */}
            {isExpanded && !routine.isCompleted && (
              <View
                style={[
                  styles.expandedToolbar,
                  {
                    borderTopColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                  },
                ]}
              >
                <View style={styles.quickCounterRow}>
                  <TouchableOpacity
                    onPress={handleDecrement}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons name="remove" size={16} color={theme.colors.onSurface} />
                  </TouchableOpacity>

                  <Text style={[styles.counterLabel, { color: theme.colors.onSurface }]}>
                    {routine.progress} de {routine.goal}
                  </Text>

                  <TouchableOpacity
                    onPress={handleIncrement}
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons name="add" size={16} color={theme.colors.onSurface} />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionIconsRow}>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={[
                      styles.actionIconBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons name="pencil-outline" size={15} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDeleteConfirmation}
                    style={[
                      styles.actionIconBtn,
                      {
                        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.10)' : '#FEF2F2',
                        borderColor: isDark ? 'rgba(239, 68, 68, 0.20)' : '#FECACA',
                      },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
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
    marginVertical: 5,
  },
  cardContainer: {
    width: '100%',
  },
  activeCard: {
    borderColor: '#38BDF8',
    transform: [{ scale: 1.01 }],
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDot: {
    marginHorizontal: 5,
    fontSize: 10,
    color: '#94A3B8',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reminderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  countButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 3.5,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  expandedToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  quickCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});