import { Routine } from '../types/routine';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressText: string;
  progressRatio: number;
}

export function computeAchievements(routines: Routine[]): Achievement[] {
  const totalRoutines = routines.length;
  const highestStreak = Math.max(0, ...routines.map((r) => Math.max(r.streak || 0, r.bestStreak || 0)));

  const totalCompletions = routines.reduce(
    (acc, r) => acc + (Array.isArray(r.completedDates) ? r.completedDates.length : r.isCompleted ? 1 : 0),
    0
  );

  const completedToday = routines.filter((r) => r.isCompleted).length;
  const isPerfectDay = totalRoutines > 0 && completedToday === totalRoutines;

  return [
    {
      id: 'first_habit',
      title: 'Primeira Semente',
      description: 'Cultivou seu primeiro hábito no Florescer',
      icon: '🌱',
      unlocked: totalRoutines >= 1,
      progressText: `${Math.min(totalRoutines, 1)}/1 hábito`,
      progressRatio: Math.min(totalRoutines / 1, 1),
    },
    {
      id: 'first_completion',
      title: 'Primeira Vitória',
      description: 'Concluiu um hábito com 100% de dedicação',
      icon: '🎯',
      unlocked: totalCompletions >= 1,
      progressText: `${Math.min(totalCompletions, 1)}/1 meta`,
      progressRatio: Math.min(totalCompletions / 1, 1),
    },
    {
      id: 'streak_3',
      title: 'Ganhando Ritmo',
      description: 'Manteve 3 dias seguidos de ofensiva',
      icon: '⚡',
      unlocked: highestStreak >= 3,
      progressText: `${Math.min(highestStreak, 3)}/3 dias`,
      progressRatio: Math.min(highestStreak / 3, 1),
    },
    {
      id: 'streak_7',
      title: 'Semana Imparável',
      description: 'Atingiu 7 dias consecutivos de constância',
      icon: '🔥',
      unlocked: highestStreak >= 7,
      progressText: `${Math.min(highestStreak, 7)}/7 dias`,
      progressRatio: Math.min(highestStreak / 7, 1),
    },
    {
      id: 'streak_30',
      title: 'Mestre da Constância',
      description: '30 dias seguidos de hábitos ativos',
      icon: '💎',
      unlocked: highestStreak >= 30,
      progressText: `${Math.min(highestStreak, 30)}/30 dias`,
      progressRatio: Math.min(highestStreak / 30, 1),
    },
    {
      id: 'perfect_day',
      title: 'Dia Perfeito',
      description: 'Concluiu todos os hábitos programados para hoje',
      icon: '🌟',
      unlocked: isPerfectDay,
      progressText: isPerfectDay ? 'Conquistado!' : `${completedToday}/${totalRoutines || 1} hoje`,
      progressRatio: totalRoutines > 0 ? completedToday / totalRoutines : 0,
    },
    {
      id: 'total_50',
      title: 'Veterano dos Hábitos',
      description: 'Atingiu a marca de 50 conclusões registradas',
      icon: '🏆',
      unlocked: totalCompletions >= 50,
      progressText: `${Math.min(totalCompletions, 50)}/50 concluídos`,
      progressRatio: Math.min(totalCompletions / 50, 1),
    },
  ];
}
