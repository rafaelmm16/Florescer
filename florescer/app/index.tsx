import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Routine } from '../types/routine';
import { useRoutineStore } from '../store/useRoutineStore';
import RoutineItem from '../components/RoutineItem';
import Header from '../components/Header';
import { useTheme } from '../components/ThemeContext';
import NewRoutineButton from '../components/NewRoutineButton';
import GlassCard from '../components/GlassCard';
import GlassBackground from '../components/GlassBackground';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const { routines, loadRoutines, updateRoutine, deleteRoutine, reorderRoutines } = useRoutineStore();
  const activeRoutines = routines.filter((r) => !r.isCompleted);
  const completedCount = routines.filter((r) => r.isCompleted).length;

  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  const toggleExpandRoutine = (id: string) => {
    setExpandedRoutines((currentExpanded) => {
      const newExpanded = new Set(currentExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    await updateRoutine(updatedRoutine);
  };

  const handleDeleteRoutine = async (id: string) => {
    await deleteRoutine(id);
  };

  const handleDragEnd = async ({ data }: { data: Routine[] }) => {
    const completedRoutines = routines.filter((r) => r.isCompleted);
    await reorderRoutines([...data, ...completedRoutines]);
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Routine>) => {
      return (
        <RoutineItem
          routine={item}
          onUpdate={handleUpdateRoutine}
          onDelete={handleDeleteRoutine}
          drag={drag}
          isActive={isActive}
          isExpanded={expandedRoutines.has(item.id)}
          onExpandToggle={() => toggleExpandRoutine(item.id)}
          index={activeRoutines.findIndex((r) => r.id === item.id)}
        />
      );
    },
    [expandedRoutines, activeRoutines]
  );

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
      <Header
        title="Minhas Rotinas"
        subtitle={formattedDate}
        right={
          <LiquidGlassView
            effect="clear"
            colorScheme={isDark ? 'dark' : 'light'}
            tintColor={isDark ? 'rgba(0, 242, 254, 0.16)' : 'rgba(6, 182, 212, 0.12)'}
            style={[
              styles.statBadge,
              {
                borderColor: isDark
                  ? 'rgba(0, 242, 254, 0.35)'
                  : 'rgba(6, 182, 212, 0.25)',
              },
              !isLiquidGlassSupported && {
                backgroundColor: isDark
                  ? 'rgba(0, 242, 254, 0.14)'
                  : 'rgba(6, 182, 212, 0.10)',
              },
            ]}
          >
            <Ionicons name="sparkles" size={13} color={theme.colors.primary} />
            <Text style={[styles.statBadgeText, { color: theme.colors.primary }]}>
              {activeRoutines.length} ativas
            </Text>
          </LiquidGlassView>
        }
      />

      {/* Daily Progress Banner if there are routines (Layered Composition with Depth) */}
      {routines.length > 0 && (
        <View style={styles.statsBannerWrapper}>
          <GlassCard borderRadius={22} layered={true} style={styles.statsCard}>
            <View>
              <View style={styles.statsRow}>
                <View style={styles.statsItem}>
                  <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                    {activeRoutines.length}
                  </Text>
                  <Text style={[styles.statsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Pendentes
                  </Text>
                </View>

                <View
                  style={[
                    styles.statsDivider,
                    { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : 'rgba(6, 182, 212, 0.15)' },
                  ]}
                />

                <View style={styles.statsItem}>
                  <Text style={[styles.statsNumber, { color: theme.colors.secondary }]}>
                    {completedCount}
                  </Text>
                  <Text style={[styles.statsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Concluídas
                  </Text>
                </View>

                <View
                  style={[
                    styles.statsDivider,
                    { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.15)' : 'rgba(6, 182, 212, 0.15)' },
                  ]}
                />

                <View style={styles.statsItem}>
                  <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                    {routines.length > 0
                      ? `${Math.round((completedCount / routines.length) * 100)}%`
                      : '0%'}
                  </Text>
                  <Text style={[styles.statsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Progresso
                  </Text>
                </View>
              </View>

              {/* Luminous Mini Sparkline Bar */}
              <View
                style={[
                  styles.sparklineTrack,
                  { backgroundColor: isDark ? 'rgba(0, 242, 254, 0.10)' : 'rgba(6, 182, 212, 0.10)' },
                ]}
              >
                <View
                  style={[
                    styles.sparklineFill,
                    {
                      width: `${routines.length > 0 ? (completedCount / routines.length) * 100 : 0}%`,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#00F2FE', '#06B6D4', '#2DD4BF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
            </View>
          </GlassCard>
        </View>
      )}

      <DraggableFlatList
        data={activeRoutines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard borderRadius={28} style={styles.emptyCard}>
              <View style={styles.emptyCardContent}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    {
                      backgroundColor: isDark
                        ? 'rgba(0, 242, 254, 0.15)'
                        : 'rgba(6, 182, 212, 0.12)',
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Ionicons name="leaf" size={42} color={theme.colors.primary} />
                </View>

                <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                  Tudo florescendo!
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  Nenhuma rotina pendente para agora. Cultive seus hábitos diários adicionando uma nova rotina.
                </Text>

                <TouchableOpacity
                  onPress={() => router.push('/new')}
                  activeOpacity={0.88}
                  style={styles.emptyButtonWrapper}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['#00F2FE', '#06B6D4', '#0891B2']
                        : ['#22D3EE', '#06B6D4', '#0891B2']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emptyButton}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.emptyButtonText}>Criar Nova Rotina</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        }
      />

      <NewRoutineButton />
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
    paddingBottom: 130, // Space for floating glass navbar and FAB
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsBannerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsCard: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    height: 28,
  },
  sparklineTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sparklineFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 26,
    paddingHorizontal: 10,
  },
  emptyButtonWrapper: {
    borderRadius: 18,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});