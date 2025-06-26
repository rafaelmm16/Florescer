import { StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ThemeContext';
import Header from '../components/Header';
import HabitForm from '../components/HabitForm';
import { Habit } from '../types/habit';
import { saveHabit } from '../utils/storage';

export default function NewHabitScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const handleSave = async (habit: Habit) => {
        await saveHabit(habit);
        router.push('/');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Novo Hábito" showBack onBack={() => router.back()} />
            <HabitForm onSubmit={handleSave} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});