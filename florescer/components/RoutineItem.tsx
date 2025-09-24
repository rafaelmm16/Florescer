// florescer/components/RoutineItem.tsx

import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';

interface RoutineItemProps {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onDelete: (id: string) => void;
  drag?: () => void;
  isActive?: boolean;
}

export default function RoutineItem({ routine, onUpdate, onDelete, drag, isActive = false }: RoutineItemProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const progressPercentage = routine.goal > 0 ? routine.progress / routine.goal : 0;

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
      `Tem certeza que deseja excluir a rotina "${routine.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => onDelete(routine.id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleEdit}
      onLongPress={!routine.isCompleted ? drag : undefined}
      disabled={isActive || routine.isCompleted}
    >
      <Card style={[styles.card, { elevation: isActive ? 8 : 2 }]}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleMedium">{routine.name}</Text>
            <View style={styles.actions}>
              {!routine.isCompleted && (
                <IconButton icon="check" size={20} onPress={handleSetCompleted} />
              )}
              <IconButton icon="delete" size={20} onPress={handleDeleteConfirmation} />
            </View>
          </View>

          {!routine.isCompleted && (
            <>
              <Text>Meta: {routine.progress} / {routine.goal}</Text>
              <ProgressBar progress={progressPercentage} color={theme.colors.primary} style={styles.progressBar} />
            </>
          )}

          {routine.isCompleted && (
            <Text style={{color: theme.colors.primary, marginTop: 10, fontWeight: 'bold'}}>Concluída!</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
  },
  progressBar: {
    marginTop: 10,
    height: 8,
    borderRadius: 4,
  },
});