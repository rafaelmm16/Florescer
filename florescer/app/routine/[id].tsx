import { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../../types/routine';
import { useRoutineStore } from '../../store/useRoutineStore';
import RoutineForm from '../../components/RoutineForm';
import Header from '../../components/Header';
import { useTheme } from '../../components/ThemeContext';
import GlassBackground from '../../components/GlassBackground';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const { routines, updateRoutine } = useRoutineStore();
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    const routineToEdit = routines.find((r) => r.id === id);
    if (routineToEdit) {
      setRoutine(routineToEdit);
    } else {
      Alert.alert('Erro', 'Rotina não encontrada.');
      router.back();
    }
  }, [id, routines]);

  const handleSave = async (routineData: {
    name: string;
    days: number[];
    goal: number;
    category: string;
    color: string;
    icon: string;
    reminderTime: string | null;
  }) => {
    if (routine) {
      if (routine.isCompleted) {
        Alert.alert('Atenção', 'Não é possível editar uma rotina já concluída.');
        return;
      }

      let notificationId = routine.notificationId;

      // If reminder changed, reschedule
      if (routine.reminderTime !== routineData.reminderTime) {
        if (notificationId) {
          const { cancelRoutineReminder } = require('../../utils/notifications');
          await cancelRoutineReminder(notificationId);
          notificationId = null;
        }

        if (routineData.reminderTime) {
          const { scheduleRoutineReminder } = require('../../utils/notifications');
          notificationId = await scheduleRoutineReminder(routine.id, routineData.name, routineData.reminderTime);
        }
      }

      const updatedRoutine: Routine = {
        ...routine,
        ...routineData,
        notificationId,
      };

      await updateRoutine(updatedRoutine);
      const { triggerSuccessHaptic } = require('../../utils/haptics');
      triggerSuccessHaptic();
      Alert.alert('Sucesso', 'Rotina atualizada com sucesso! ✨');
      router.back();
    }
  };

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Editar Rotina"
          subtitle="Ajustar Hábito"
          showBack
          onBack={() => router.back()}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {routine ? (
            <RoutineForm
              onSave={handleSave}
              initialRoutine={routine}
              disabled={routine.isCompleted}
            />
          ) : null}
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