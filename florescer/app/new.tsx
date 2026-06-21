import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../types/routine';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineForm from '../components/RoutineForm';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function NewRoutineScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { addRoutine } = useRoutineStore();

    const handleSave = async (routineData: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => {
        try {
            const newRoutine: Routine = {
                id: Date.now().toString(),
                ...routineData,
                progress: 0,
                isCompleted: false,
            };
            await addRoutine(newRoutine);
            Alert.alert("Sucesso", "Nova rotina criada com sucesso! 🌱");
            router.back();
        } catch (e) {
            console.error("Failed to save new routine.", e);
            Alert.alert("Erro", "Não foi possível criar a nova rotina.");
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