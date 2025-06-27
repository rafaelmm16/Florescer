import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
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

  // CORRIGIDO: Atualiza o estado da UI diretamente após a ação
  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);
    
    if (updatedRoutine.isDeleted || updatedRoutine.isCompleted) {
      // Remove a rotina da lista se foi deletada ou concluída
      setRoutines(prevRoutines =>
        prevRoutines.filter(r => r.id !== updatedRoutine.id)
      );
    } else {
      // Atualiza a rotina na lista para outras mudanças (ex: progresso)
      setRoutines(prevRoutines =>
        prevRoutines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r)
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
              Crie sua primeira rotina!
            </Button>
          </View>
        }
      />
      <Button
        icon="plus"
        mode="fab"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => router.push('/new')}
        color={theme.colors.onPrimaryContainer}
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