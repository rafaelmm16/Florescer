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

export default function NewRoutineScreen() {
  const router = useRouter();
  const { addRoutine } = useRoutineStore();
  const { theme } = useTheme();

  const handleSave = async (routineData: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => {
    try {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        ...routineData,
        progress: 0,
        isCompleted: false,
      };
      await addRoutine(newRoutine);
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