// florescer/app/new.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routine } from '../types/routine';
import { addRoutine } from '../utils/storage';
import RoutineForm from '../components/RoutineForm';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';

export default function NewRoutineScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const handleSave = async (routineData: Omit<Routine, 'id' | 'progress' | 'isCompleted'>) => {
        try {
            await addRoutine(routineData);
            Alert.alert("Sucesso", "Nova rotina criada!");
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