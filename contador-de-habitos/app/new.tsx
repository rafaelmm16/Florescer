import { StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

// 1. Importe o hook useTheme do seu contexto
import { useTheme } from '../components/ThemeContext';

import Header from '../components/Header';
import HabitForm from '../components/HabitForm';
import { Habit } from '../types/habit';
import { saveHabit } from '../utils/storage';

export default function NewHabitScreen() {
    const router = useRouter();
    
    // 2. Chame o hook para obter o tema atual
    const { theme } = useTheme();

    const handleSave = async (habit: Omit<Habit, 'id'>) => {
        await saveHabit(habit);
        router.push('/');
    };

    // 3. Aplique a cor de fundo do tema ao contêiner principal (SafeAreaView)
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Novo Hábito" showBack onBack={() => router.back()} />
            <HabitForm onSave={handleSave} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});