// app/completed.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getRoutines, updateRoutine } from '../utils/storage';
import RoutineItem from '../components/RoutineItem';
import { Routine } from '../types/routine';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useTheme } from '../components/ThemeContext';

export default function CompletedScreen() {
    const [completedRoutines, setCompletedRoutines] = useState<Routine[]>([]);
    const { theme } = useTheme();
    const isFocused = useIsFocused();

    const loadCompletedRoutines = async () => {
        const allRoutines = await getRoutines();
        // Carrega rotinas que estão completas mas não deletadas
        const filteredRoutines = allRoutines.filter(r => r.isCompleted && !r.isDeleted);
        setCompletedRoutines(filteredRoutines);
    };

    useEffect(() => {
        if (isFocused) {
            loadCompletedRoutines();
        }
    }, [isFocused]);

    const handleUpdateCompletedRoutine = async (updatedRoutine: Routine) => {
        await updateRoutine(updatedRoutine);

        if (updatedRoutine.isDeleted || !updatedRoutine.isCompleted) {
            setCompletedRoutines(prevRoutines =>
                prevRoutines.filter(routine => routine.id !== updatedRoutine.id)
            );
        } else {
            setCompletedRoutines(prevRoutines =>
                prevRoutines.map(routine =>
                    routine.id === updatedRoutine.id ? updatedRoutine : routine
                )
            );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Rotinas Concluídas" />
            <FlatList
                data={completedRoutines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RoutineItem routine={item} onUpdate={handleUpdateCompletedRoutine} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>Nenhuma rotina concluída.</Text>
                    </View>
                }
            />
            <Navbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 8,
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 20,
    },
});