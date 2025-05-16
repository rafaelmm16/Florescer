import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useState, useCallback } from 'react';
import HabitItem from '../components/HabitItem';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { Link, useFocusEffect } from 'expo-router';
import colors from '../constants/colors';
import Header from '../components/Header';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [trash, setTrash] = useState<Habit[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHabits().then(data => {
        setHabits(data?.habits || []);
        setTrash(data?.trash || []);
      });
    }, [])
  );

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabits(updatedHabits);
    saveHabits({ habits: updatedHabits, trash });
  };

  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (!habitToDelete) return;
    if (window.confirm(`Deseja mover "${habitToDelete.name}" para a lixeira?`)) {
      const updatedHabits = habits.filter(h => h.id !== id);
      const updatedTrash = [habitToDelete, ...trash];
      setHabits(updatedHabits);
      setTrash(updatedTrash);
      saveHabits({ habits: updatedHabits, trash: updatedTrash });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Meus Hábitos"
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Link href="/trash" asChild>
              <TouchableOpacity style={styles.trashButton}>
                <Text style={styles.trashButtonText}>Lixeira</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/new" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>+ Novo Hábito</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
      />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem habit={item} onToggle={toggleHabit} onDelete={deleteHabit} />
        )}
        contentContainerStyle={habits.length === 0 && styles.emptyList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  trashButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
    marginRight: 8,
  },
  trashButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.placeholder,
    fontSize: 18,
    marginTop: 40,
    textAlign: 'center',
  },
});