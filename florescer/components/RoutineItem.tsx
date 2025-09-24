// florescer/components/RoutineItem.tsx

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, IconButton, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';
import { deleteRoutine } from '../utils/storage';

interface RoutineItemProps {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export default function RoutineItem({ routine, onUpdate, onDelete }: RoutineItemProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const progressPercentage = routine.goal > 0 ? routine.progress / routine.goal : 0;

  const handleSetCompleted = () => {
    const updatedRoutine = { ...routine, progress: routine.goal, isCompleted: true };
    onUpdate(updatedRoutine);
  };

  const handleEdit = () => {
    router.push(`/routine/${routine.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Permanentemente",
      `Esta ação não pode ser desfeita. Deseja excluir a rotina "${routine.name}" para sempre?`,
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
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{routine.name}</Text>
          <View style={styles.actions}>
            {!routine.isCompleted && (
              <>
                <IconButton icon="check" size={20} onPress={handleSetCompleted} />
                <IconButton icon="pencil" size={20} onPress={handleEdit} />
              </>
            )}
            <IconButton icon="delete" size={20} onPress={handleDelete} />
          </View>
        </View>

        {!routine.isCompleted && (
          <>
            <Text>Meta: {routine.progress} / {routine.goal}</Text>
            <ProgressBar progress={progressPercentage} color={theme.colors.primary} style={styles.progressBar} />
          </>
        )}
      </Card.Content>
    </Card>
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