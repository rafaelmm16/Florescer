// contador-de-habitos/app/routine/[id].tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../../types/routine';
import { getRoutines, updateRoutine } from '../../utils/storage';
import RoutineForm from '../../components/RoutineForm';
import Header from '../../components/Header';
import { useTheme } from '../../components/ThemeContext';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    const loadRoutine = async () => {
      const routines = await getRoutines();
      const routineToEdit = routines.find(r => r.id === id);
      if (routineToEdit) {
        setRoutine(routineToEdit);
      } else {
        Alert.alert("Erro", "Rotina não encontrada.");
        router.back();
      }
    };
    loadRoutine();
  }, [id]);

  const handleSave = async (routineData: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => {
    if (routine) {
      if (routine.isCompleted) {
        Alert.alert("Atenção", "Não é possível editar uma rotina já concluída.");
        return;
      }
      const updatedRoutine = {
        ...routine,
        ...routineData,
      };
      await updateRoutine(updatedRoutine);
      Alert.alert("Sucesso", "Rotina atualizada com sucesso!");
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Editar Rotina" showBack onBack={() => router.back()} />
      <View style={styles.content}>
        {routine ? (
          <RoutineForm
            onSave={handleSave}
            initialRoutine={routine}
            disabled={routine.isCompleted}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});