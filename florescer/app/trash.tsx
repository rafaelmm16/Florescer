// contador-de-habitos/app/trash.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Routine } from '../types/routine';
import { getRoutines, updateRoutine, saveRoutines } from '../utils/storage';
import RoutineItem from '../components/RoutineItem';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function TrashScreen() {
  const [deletedRoutines, setDeletedRoutines] = useState<Routine[]>([]);
  const isFocused = useIsFocused();
  const { theme } = useTheme();

  const loadRoutines = async () => {
    const allRoutines = await getRoutines();
    // Limpa rotinas na lixeira há mais de 30 dias
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const currentRoutines = allRoutines.filter(r => !r.isDeleted || (r.deletedTimestamp && r.deletedTimestamp > thirtyDaysAgo));

    if(currentRoutines.length < allRoutines.length){
        await saveRoutines(currentRoutines);
    }

    setDeletedRoutines(currentRoutines.filter(r => r.isDeleted));
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  const restoreRoutine = async (id: string) => {
    const routineToRestore = deletedRoutines.find(r => r.id === id);
    if(routineToRestore) {
        await updateRoutine({ ...routineToRestore, isDeleted: false, deletedTimestamp: undefined });
        loadRoutines();
        Alert.alert("Sucesso", `A rotina "${routineToRestore.name}" foi restaurada.`);
    }
  };

  const deleteRoutinePermanently = async (id: string) => {
    const routines = await getRoutines();
    const routineToDelete = routines.find(r => r.id === id);
    const updatedRoutines = routines.filter(r => r.id !== id);
    await saveRoutines(updatedRoutines);
    loadRoutines();
    if(routineToDelete) {
        Alert.alert("Excluída", `A rotina "${routineToDelete.name}" foi excluída permanentemente.`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Lixeira" />
      <FlatList
        data={deletedRoutines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoutineItem
            routine={item}
            onUpdate={() => {}}
            onRestore={restoreRoutine}
            onDeletePermanent={deleteRoutinePermanently}
            isTrash
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.onSurfaceVariant}]}>A lixeira está vazia.</Text>
          </View>
        }
      />
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    // Estilos permanecem os mesmos
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