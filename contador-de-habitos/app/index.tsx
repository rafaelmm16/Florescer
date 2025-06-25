import { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, FlatList, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FAB, Text } from 'react-native-paper';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { useTheme } from '../components/ThemeContext';

import HabitItem from '../components/HabitItem';
import Header from '../components/Header';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHabits().then(data => {
        setHabits((data?.habits || []).filter(h => !h.done));
      });
    }, [])
  );

  const toggleHabit = (habit: Habit) => {
    const newHabits = habits.map(h =>
      h.id === habit.id ? { ...h, done: !h.done } : h
    );
    loadHabits().then(data => saveHabits({ ...data, habits: newHabits }));
    setHabits(newHabits.filter(h => !h.done));
  };

  const deleteHabit = (id: string) => {
    loadHabits().then(data => {
      const habitToDelete = data.habits.find(h => h.id === id);
      if (habitToDelete) {
        const newHabits = data.habits.filter(h => h.id !== id);
        const newTrash = [...data.trash, { ...habitToDelete, deletedAt: new Date().toISOString() }];
        saveHabits({ ...data, habits: newHabits, trash: newTrash });
        setHabits(newHabits.filter(h => !h.done));
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Meus Hábitos" />
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onPress={toggleHabit}
            onDelete={deleteHabit}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Você ainda não tem hábitos. Crie um novo!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        color={theme.colors.onPrimaryContainer}
        onPress={() => router.push('/new')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 150,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});