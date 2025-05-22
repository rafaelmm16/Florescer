import HabitForm from '../components/HabitForm';
import { useEffect, useState } from 'react';
import { loadHabits, saveHabits } from '../utils/storage';
import { Habit } from '../types/habit';
import { SafeAreaView, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function NewHabitScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    loadHabits().then(data => {
      setHabits(data?.habits || []);
    });
  }, []);

  const handleSubmit = (newHabit: Habit) => {
    loadHabits().then(data => {
      const updated = [...(data?.habits || []), newHabit];
      saveHabits({ habits: updated, trash: data?.trash || [] });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    });
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#181825' : colors.background }
    ]}>
      <Header title="Adicionar Novo Hábito" showBack onBack={() => router.back()} />
      <HabitForm onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
});