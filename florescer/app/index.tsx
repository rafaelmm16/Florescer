import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Routine } from '../types/routine';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import NewRoutineButton from '../components/NewRoutineButton';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const { routines, loadRoutines, updateRoutine, deleteRoutine, reorderRoutines } = useRoutineStore();
  const activeRoutines = routines.filter(r => !r.isCompleted);

  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

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
  };

  const handleDeleteRoutine = async (id: string) => {
    await deleteRoutine(id);
  };

  const handleDragEnd = async ({ data }: { data: Routine[] }) => {
    const completedRoutines = routines.filter(r => r.isCompleted);
    await reorderRoutines([...data, ...completedRoutines]);
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
        index={activeRoutines.findIndex(r => r.id === item.id)}
      />
    );
  }, [expandedRoutines, activeRoutines]);

  const today = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(new Date());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Minhas Rotinas" subtitle={today} />
      <DraggableFlatList
        data={activeRoutines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>Tudo limpo por aqui!</Text>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>Que tal adicionar um novo hábito para hoje?</Text>
            <Button 
              mode="contained" 
              onPress={() => router.push('/new')}
              buttonColor={theme.colors.primary}
              style={styles.emptyButton}
            >
              Criar Rotina
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
    paddingHorizontal: 24,
    paddingBottom: 120, // Extra space for navbar and FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
  }
});