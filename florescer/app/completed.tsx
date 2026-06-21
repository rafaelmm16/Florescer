import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompletedScreen() {
    const { theme } = useTheme();
    const { routines, loadRoutines, updateRoutine, deleteRoutine } = useRoutineStore();
    
    const completedRoutines = routines.filter(r => r.isCompleted);

    useFocusEffect(
        useCallback(() => {
            loadRoutines();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Header title="Concluídos" subtitle="Seu histórico de conquistas" />
            <FlatList
                data={completedRoutines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <RoutineItem
                        routine={item}
                        onUpdate={updateRoutine}
                        onDelete={deleteRoutine}
                        isExpanded={false}
                        onExpandToggle={() => {}}
                        index={index}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>Nenhuma rotina concluída</Text>
                        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                            Complete seus hábitos diários para vê-los aqui.
                        </Text>
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
        paddingHorizontal: 24,
        paddingBottom: 120, // Space for navbar
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});