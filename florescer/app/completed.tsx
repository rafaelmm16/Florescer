import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';

export default function CompletedScreen() {
  const { theme, isDark } = useTheme();
  const { routines, loadRoutines, updateRoutine, deleteRoutine } = useRoutineStore();

  const completedRoutines = routines.filter((r) => r.isCompleted);

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  const highestStreak = Math.max(
    0,
    ...routines.map((r) => Math.max(r.streak || 0, r.bestStreak || 0))
  );

  const totalCompletions = routines.reduce(
    (acc, r) => acc + (Array.isArray(r.completedDates) ? r.completedDates.length : r.isCompleted ? 1 : 0),
    0
  );

  const completionRate =
    routines.length > 0
      ? Math.round((completedRoutines.length / routines.length) * 100)
      : 0;

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Conquistas"
          subtitle="Histórico & Desempenho"
          right={
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.badgePillText, { color: isDark ? '#34D399' : '#059669' }]}>
                {completedRoutines.length} concluídas
              </Text>
            </View>
          }
        />

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
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Minimalist 3-Stat Row */}
              <View style={styles.statsRow}>
                {/* Streak Record */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: isDark ? '#FB923C' : '#EA580C' }]}>
                      {highestStreak}d
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Recorde 🔥
                    </Text>
                  </View>
                </GlassCard>

                {/* Total Completions */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                      {totalCompletions}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Feitos 🎯
                    </Text>
                  </View>
                </GlassCard>

                {/* Today's Rate */}
                <GlassCard borderRadius={16} style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: isDark ? '#34D399' : '#059669' }]}>
                      {completionRate}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Hoje ⚡
                    </Text>
                  </View>
                </GlassCard>
              </View>

              {/* Consistency Heatmap */}
              <ConsistencyHeatmap routines={routines} />

              {completedRoutines.length > 0 && (
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Concluídos Hoje
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <GlassCard borderRadius={18} style={styles.emptyCard}>
                <View style={styles.emptyCardContent}>
                  <View
                    style={[
                      styles.emptyIconCircle,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Ionicons
                      name="trophy-outline"
                      size={28}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                    Nenhuma conclusão hoje
                  </Text>
                  <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    Conclua seus hábitos na tela inicial para acompanhar a sua evolução aqui.
                  </Text>
                </View>
              </GlassCard>
            </View>
          }
        />
      </SafeAreaView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 6,
  },
  emptyContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
});