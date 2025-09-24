// app/completed.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getRoutines, updateRoutine, deleteRoutine } from '../utils/storage';
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
        const filteredRoutines = allRoutines.filter(r => r.isCompleted);
        setCompletedRoutines(filteredRoutines);
    };

    useEffect(() => {
        if (isFocused) {
            loadCompletedRoutines();
        }
    }, [isFocused]);

    const handleUpdateCompletedRoutine = async (updatedRoutine: Routine) => {
        await updateRoutine(updatedRoutine);
        loadCompletedRoutines();
    };

    const handleDeleteRoutine = async (id: string) => {
        await deleteRoutine(id);
        loadCompletedRoutines();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Rotinas Concluídas" />
            <FlatList
                data={completedRoutines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RoutineItem
                        routine={item}
                        onUpdate={handleUpdateCompletedRoutine}
                        onDelete={handleDeleteRoutine}
                    />
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