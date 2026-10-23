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
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';

export default function CompletedScreen() {
  const { theme, isDark } = useTheme();
  const { routines, loadRoutines, updateRoutine, deleteRoutine } = useRoutineStore();

  const completedRoutines = routines.filter((r) => r.isCompleted);

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  return (
    <GlassBackground>
      <SafeAreaView style={styles.safeArea}>
      <Header
        title="Concluídos"
        subtitle="Histórico de Conquistas"
        right={
          <LiquidGlassView
            effect="clear"
            colorScheme={isDark ? 'dark' : 'light'}
            tintColor={isDark ? 'rgba(0, 242, 254, 0.16)' : 'rgba(6, 182, 212, 0.12)'}
            style={[
              styles.trophyBadge,
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
            <Ionicons name="trophy" size={14} color={theme.colors.primary} />
            <Text style={[styles.trophyBadgeText, { color: theme.colors.primary }]}>
              {completedRoutines.length} feitas
            </Text>
          </LiquidGlassView>
        }
      />

      {/* Achievement Hero Card if there are completions (Layered Composition with Depth) */}
      {completedRoutines.length > 0 && (
        <View style={styles.heroWrapper}>
          <GlassCard borderRadius={22} layered={true} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View
                style={[
                  styles.trophyIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(0, 242, 254, 0.18)'
                      : 'rgba(6, 182, 212, 0.14)',
                    borderColor: isDark
                      ? 'rgba(0, 242, 254, 0.40)'
                      : 'rgba(6, 182, 212, 0.30)',
                  },
                ]}
              >
                <Ionicons name="ribbon" size={26} color={theme.colors.primary} />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={[styles.heroTitle, { color: theme.colors.onSurface }]}>
                  Florescendo a cada passo! ✨
                </Text>
                <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Você concluiu {completedRoutines.length}{' '}
                  {completedRoutines.length === 1 ? 'rotina' : 'rotinas'}. Mantenha o ritmo!
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>
      )}

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard borderRadius={20} style={styles.emptyCard}>
              <View style={styles.emptyCardContent}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    {
                      backgroundColor: isDark
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(245, 158, 11, 0.1)',
                      borderColor: isDark
                        ? 'rgba(245, 158, 11, 0.3)'
                        : 'rgba(245, 158, 11, 0.25)',
                    },
                  ]}
                >
                  <Ionicons name="trophy-outline" size={42} color={theme.colors.accent} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                  Nenhuma conquista ainda
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  Conclua seus hábitos na tela inicial para acompanhar o seu progresso aqui.
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
    paddingTop: 6,
    paddingBottom: 120, // Space for floating glass navbar
  },
  trophyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  trophyBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  heroWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  heroCard: {
    width: '100%',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  trophyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
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
    paddingHorizontal: 16,
  },
});