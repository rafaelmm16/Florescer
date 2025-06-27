// contador-de-habitos/app/new.tsx
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import RoutineForm from '../components/RoutineForm';
import { addRoutine } from '../utils/storage';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function NewRoutineScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // A tipagem de 'routineData' foi ajustada para corresponder à nova função 'addRoutine'
  const handleSave = async (routineData: { name: string, days: number[], goal: number }) => {
    try {
      // Validação para garantir que o nome não está vazio
      if (!routineData.name || routineData.name.trim() === "") {
        Alert.alert("Erro", "O nome da rotina não pode estar vazio.");
        return;
      }
      
      await addRoutine(routineData);
      Alert.alert("Sucesso", "Rotina salva com sucesso!");
      router.push('/');
    } catch (error) {
      console.error("Falha ao salvar a rotina:", error);
      Alert.alert("Erro", "Não foi possível salvar a rotina.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
       <Header title="Nova Rotina" showBack onBack={() => router.back()} />
       <View style={styles.content}>
            <RoutineForm onSave={handleSave} />
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