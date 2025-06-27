import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, IconButton, ProgressBar, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Routine } from '../types/routine';
import { useTheme } from './ThemeContext';

interface RoutineItemProps {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onRestore?: (id: string) => void;
  onDeletePermanent?: (id: string) => void;
  isTrash?: boolean;
}

export default function RoutineItem({ routine, onUpdate, onRestore, onDeletePermanent, isTrash = false }: RoutineItemProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const progressPercentage = routine.goal > 0 ? routine.progress / routine.goal : 0;

  const handleIncrement = () => {
    if (routine.progress < routine.goal) {
      const updatedRoutine = { ...routine, progress: routine.progress + 1 };
      if (updatedRoutine.progress === routine.goal) {
        updatedRoutine.isCompleted = true;
      }
      onUpdate(updatedRoutine);
    }
  };

  const handleDecrement = () => {
    if (routine.progress > 0) {
      const updatedRoutine = { ...routine, progress: routine.progress - 1, isCompleted: false };
      onUpdate(updatedRoutine);
    }
  };

  const handleEdit = () => {
    router.push(`/routine/${routine.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Mover para a Lixeira",
      `Tem certeza que deseja mover a rotina "${routine.name}" para a lixeira?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Mover",
          onPress: () => onUpdate({ ...routine, isDeleted: true, deletedTimestamp: Date.now() }),
          style: "destructive",
        },
      ]
    );
  };
  
  const handleRestore = () => {
      if(onRestore) onRestore(routine.id);
  };

  const handleDeletePermanent = () => {
    Alert.alert(
      "Excluir Permanentemente",
      `Esta ação não pode ser desfeita. Deseja excluir a rotina "${routine.name}" para sempre?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
              if(onDeletePermanent) onDeletePermanent(routine.id)
            },
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
          {!isTrash && (
             <View style={styles.actions}>
                <IconButton icon="pencil" size={20} onPress={handleEdit} />
                <IconButton icon="delete" size={20} onPress={handleDelete} />
             </View>
          )}
        </View>
        
        {!isTrash && (
            <>
                <Text>Meta: {routine.progress} / {routine.goal}</Text>
                <ProgressBar progress={progressPercentage} color={theme.colors.primary} style={styles.progressBar} />
                <View style={styles.controls}>
                    <IconButton icon="minus" mode='contained' size={20} onPress={handleDecrement} disabled={routine.progress <= 0}/>
                    <IconButton icon="plus" mode='contained' size={20} onPress={handleIncrement} disabled={routine.progress >= routine.goal}/>
                </View>
            </>
        )}

        {isTrash && (
            <View style={styles.trashControls}>
                <Button icon="restore" mode="outlined" onPress={handleRestore}>Restaurar</Button>
                <Button icon="delete-forever" mode="contained" onPress={handleDeletePermanent} buttonColor={theme.colors.error}>Excluir</Button>
            </View>
        )}

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Estilos permanecem os mesmos
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
    controls: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    trashControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    }
});