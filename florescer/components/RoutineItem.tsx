import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Pressable, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import { SvgXml } from 'react-native-svg';

const OptionsIcon = ({ color }: { color: string }) => (
  <SvgXml
    width={24}
    height={24}
    xml={`<svg width="24" viewBox="0 -960 960 960" height="24" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z" /></svg>`}
  />
);

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

export default function RoutineItem({ routine, onUpdate, onDelete, drag, isActive = false, isExpanded, onExpandToggle, index }: RoutineItemProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const scaleValue = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(routine.progress / routine.goal)).current;

  useEffect(() => {
    Animated.spring(progressWidth, {
      toValue: routine.progress / routine.goal,
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
      "Excluir Rotina",
      `Tem certeza que deseja excluir a rotina "${routine.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => onDelete(routine.id), style: "destructive" },
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

  const progressPercent = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable
      onPress={onExpandToggle}
      onLongPress={!routine.isCompleted ? drag : undefined}
      disabled={isActive || routine.isCompleted}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.surfaceVariant,
          transform: [{ scale: scaleValue }],
          shadowColor: theme.colors.shadow,
        }
      ]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {routine.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
              {routine.progress} / {routine.goal}
            </Text>
          </View>
        </View>

        <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Animated.View style={[
            styles.progressBarFill, 
            { 
              backgroundColor: theme.colors.primary,
              width: progressPercent 
            }
          ]} />
        </View>

        {isExpanded && !routine.isCompleted && (
          <View style={styles.expandedOptions}>
            <IconButton icon="minus" size={20} iconColor={theme.colors.onSurfaceVariant} onPress={handleDecrement} />
            <IconButton icon="plus" size={20} iconColor={theme.colors.primary} onPress={handleIncrement} />
            <IconButton icon="check" size={20} iconColor={theme.colors.success} onPress={handleSetCompleted} />
            <IconButton icon="pencil" size={20} iconColor={theme.colors.onSurfaceVariant} onPress={handleEdit} />
            <IconButton icon="delete" size={20} iconColor={theme.colors.danger} onPress={handleDeleteConfirmation} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  expandedOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});