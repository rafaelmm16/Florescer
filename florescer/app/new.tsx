import React from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../types/routine';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineForm from '../components/RoutineForm';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import GlassBackground from '../components/GlassBackground';

import { scheduleRoutineReminder } from '../utils/notifications';
import { triggerSuccessHaptic } from '../utils/haptics';

export default function NewRoutineScreen() {
  const router = useRouter();
  const { addRoutine } = useRoutineStore();
  const { theme } = useTheme();

  const handleSave = async (routineData: {
    name: string;
    days: number[];
    goal: number;
    category: string;
    color: string;
    icon: string;
    reminderTime: string | null;
  }) => {
    try {
      const id = Date.now().toString();
      let notificationId: string | null = null;

      if (routineData.reminderTime) {
        notificationId = await scheduleRoutineReminder(id, routineData.name, routineData.reminderTime);
      }

      const newRoutine: Routine = {
        id,
        name: routineData.name,
        days: routineData.days,
        goal: routineData.goal,
        category: routineData.category,
        color: routineData.color,
        icon: routineData.icon,
        reminderTime: routineData.reminderTime,
        notificationId,
        progress: 0,
        isCompleted: false,
        streak: 0,
        bestStreak: 0,
        lastCompletedDate: null,
        completedDates: [],
      };

      await addRoutine(newRoutine);
      triggerSuccessHaptic();
      Alert.alert('Sucesso', 'Nova rotina cultivada com sucesso! 🌱');
      router.back();
    } catch (e) {
      console.error('Failed to save new routine.', e);
      Alert.alert('Erro', 'Não foi possível criar a nova rotina.');
    }
  };

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Nova Rotina"
          subtitle="Cultive um Novo Hábito"
          showBack
          onBack={() => router.back()}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <RoutineForm onSave={handleSave} />
        </ScrollView>
      </SafeAreaView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
});