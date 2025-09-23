// app/index.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button, FAB } from 'react-native-paper';
import { Routine } from '../types/routine';
import { getRoutines, updateRoutine } from '../utils/storage';
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
    const activeRoutines = allRoutines.filter(r => !r.isDeleted && !r.isCompleted);
    setRoutines(activeRoutines);
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);

    // Se a rotina for movida para a lixeira OU marcada como concluída,
    // ela é removida da lista da tela inicial.
    if (updatedRoutine.isDeleted || updatedRoutine.isCompleted) {
      setRoutines(prevRoutines =>
        prevRoutines.filter(routine => routine.id !== updatedRoutine.id)
      );
    } else {
      // Caso contrário, apenas atualiza o item na lista.
      setRoutines(prevRoutines =>
        prevRoutines.map(routine =>
          routine.id === updatedRoutine.id ? updatedRoutine : routine
        )
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Minhas Rotinas" />
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RoutineItem routine={item} onUpdate={handleUpdateRoutine} />
        )}
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
        size="medium" // 'small', 'medium', ou 'large'
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