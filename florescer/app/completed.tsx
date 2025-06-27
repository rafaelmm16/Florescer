import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Routine } from '../types/routine';
import { getRoutines, updateRoutine } from '../utils/storage';
import RoutineItem from '../components/RoutineItem';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function CompletedScreen() {
  const [completedRoutines, setCompletedRoutines] = useState<Routine[]>([]);
  const isFocused = useIsFocused();
  const { theme } = useTheme();

  const loadRoutines = async () => {
    const allRoutines = await getRoutines();
    setCompletedRoutines(allRoutines.filter(r => r.isCompleted && !r.isDeleted));
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  // CORRIGIDO: Atualiza o estado da UI diretamente
  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);
    
    if (updatedRoutine.isDeleted || !updatedRoutine.isCompleted) {
        // Remove da lista se foi deletada ou não está mais completa
        setCompletedRoutines(prevRoutines =>
            prevRoutines.filter(r => r.id !== updatedRoutine.id)
        );
    } else {
        // Atualiza a rotina na lista
        setCompletedRoutines(prevRoutines =>
            prevRoutines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r)
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Rotinas Concluídas" />
      <FlatList
        data={completedRoutines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoutineItem routine={item} onUpdate={handleUpdateRoutine} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: theme.colors.onSurfaceVariant}]}>Nenhuma rotina concluída ainda.</Text>
            </View>
        }
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
    }
});