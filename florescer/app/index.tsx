// app/index.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button, FAB } from 'react-native-paper';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Routine } from '../types/routine';
import { getRoutines, updateRoutine, deleteRoutine, saveRoutines } from '../utils/storage';
import RoutineItem from '../components/RoutineItem';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([]);
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

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);
    if (updatedRoutine.isCompleted) {
      setRoutines(prev => prev.filter(r => r.id !== updatedRoutine.id));
    } else {
      setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    await deleteRoutine(id);
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Routine>) => {
    return (
      <RoutineItem
        routine={item}
        onUpdate={handleUpdateRoutine}
        onDelete={handleDeleteRoutine}
        drag={drag}
        isActive={isActive}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Minhas Rotinas" />
      <DraggableFlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onDragEnd={({ data }) => {
          setRoutines(data);
          saveRoutines(data);
        }}
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
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        color={theme.colors.onPrimaryContainer}
        size="medium"
        onPress={() => router.push('/new')}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
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
  }
});