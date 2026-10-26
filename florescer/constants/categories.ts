export interface HabitCategory {
  id: string;
  name: string;
  icon: string; // Ionicons name
  color: string; // Primary hex color
  secondaryColor: string; // Secondary gradient hex color
  description: string;
}

export const HABIT_CATEGORIES: HabitCategory[] = [
  {
    id: 'health',
    name: 'Saúde & Água',
    icon: 'water-outline',
    color: '#06B6D4', // Cyan
    secondaryColor: '#3B82F6',
    description: 'Hidratação, remédios, alimentação saudável',
  },
  {
    id: 'study',
    name: 'Estudos & Leitura',
    icon: 'book-outline',
    color: '#8B5CF6', // Violet
    secondaryColor: '#A855F7',
    description: 'Leitura, cursos, idiomas e escrita',
  },
  {
    id: 'mind',
    name: 'Mente & Calma',
    icon: 'leaf-outline',
    color: '#10B981', // Emerald
    secondaryColor: '#14B8A6',
    description: 'Meditação, respiração, gratidão',
  },
  {
    id: 'fitness',
    name: 'Treino & Corpo',
    icon: 'fitness-outline',
    color: '#F59E0B', // Amber
    secondaryColor: '#F97316',
    description: 'Exercícios físicos, caminhada, corrida',
  },
  {
    id: 'work',
    name: 'Foco & Trabalho',
    icon: 'briefcase-outline',
    color: '#EC4899', // Pink
    secondaryColor: '#F43F5E',
    description: 'Metas diárias, projetos e organização',
  },
  {
    id: 'personal',
    name: 'Pessoal & Lazer',
    icon: 'sparkles-outline',
    color: '#6366F1', // Indigo
    secondaryColor: '#818CF8',
    description: 'Hobbies, sono, descanso e momentos felizes',
  },
];

export const PRESET_COLORS = [
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#EF4444', // Red
  '#14B8A6', // Teal
];

export const PRESET_ICONS = [
  'water-outline',
  'book-outline',
  'leaf-outline',
  'fitness-outline',
  'briefcase-outline',
  'sparkles-outline',
  'heart-outline',
  'walk-outline',
  'bed-outline',
  'sunny-outline',
  'musical-notes-outline',
  'bicycle-outline',
];

export function getCategoryById(id?: string): HabitCategory {
  const found = HABIT_CATEGORIES.find((cat) => cat.id === id);
  return found || HABIT_CATEGORIES[0];
}
