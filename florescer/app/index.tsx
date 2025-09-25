// app/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper'; // Removido o FAB
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Routine } from '../types/routine';
import { getRoutines, updateRoutine, deleteRoutine, saveRoutines } from '../utils/storage';
import RoutineItem from '../components/RoutineItem';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import NewRoutineButton from '../components/NewRoutineButton';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([]);
  // Novo estado para controlar os cards expandidos
  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());
  const isFocused = useIsFocused();

  const loadRoutines = async () => {
    const allRoutines = await getRoutines();
    const activeRoutines = allRoutines.filter(r => !r.isCompleted);
    setRoutines(activeRoutines);
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  // Função para alternar a expansão de um card
  const toggleExpandRoutine = (id: string) => {
    setExpandedRoutines(currentExpanded => {
      const newExpanded = new Set(currentExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);

    if (updatedRoutine.isCompleted) {
      setRoutines(currentRoutines =>
        currentRoutines.filter(r => r.id !== updatedRoutine.id)
      );
    } else {
      setRoutines(currentRoutines =>
        currentRoutines.map(r => (r.id === updatedRoutine.id ? updatedRoutine : r))
      );
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    await deleteRoutine(id);
    setRoutines(prevRoutines => prevRoutines.filter(routine => routine.id !== id));
  };

  const handleDragEnd = async ({ data }: { data: Routine[] }) => {
    setRoutines(data);
    const allRoutines = await getRoutines();
    const completedRoutines = allRoutines.filter(r => r.isCompleted);
    await saveRoutines([...data, ...completedRoutines]);
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Routine>) => {
    return (
      <RoutineItem
        routine={item}
        onUpdate={handleUpdateRoutine}
        onDelete={handleDeleteRoutine}
        drag={drag}
        isActive={isActive}
        isExpanded={expandedRoutines.has(item.id)}
        onExpandToggle={() => toggleExpandRoutine(item.id)}
      />
    );
  }, [handleUpdateRoutine, handleDeleteRoutine, expandedRoutines]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Minhas Rotinas" />
      <DraggableFlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>Nenhuma rotina por aqui.</Text>
            <Button mode="contained" onPress={() => router.push('/new')}>
              Crie a sua primeira rotina!
            </Button>
          </View>
        }
      />

      <NewRoutineButton />

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 8,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
});