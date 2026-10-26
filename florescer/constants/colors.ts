// Modern Minimalist Design Tokens (Linear / Apple-inspired)

export const lightColors = {
  // Brand & Accents
  primary: '#0F172A', // Slate 900 for modern high-contrast typography & buttons
  primaryContainer: '#F1F5F9', // Slate 100
  secondary: '#10B981', // Clean Emerald for completions
  secondaryContainer: '#ECFDF5',
  tertiary: '#0EA5E9', // Clean Sky Blue
  tertiaryContainer: '#F0F9FF',
  accent: '#10B981', // Emerald

  // Surfaces & Backgrounds
  background: '#F8FAFC', // Ultra-clean subtle off-white
  surface: '#FFFFFF', // Pure white cards
  surfaceVariant: '#F1F5F9', // Subtle card container
  card: '#FFFFFF',
  cardBorder: '#E2E8F0', // Soft 1px border

  // Text & Typography
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0F172A',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#065F46',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#0369A1',
  onSurface: '#0F172A', // Crisp charcoal
  onSurfaceVariant: '#64748B', // Elegant muted slate
  onError: '#FFFFFF',

  // Interactive & Feedback
  outline: '#E2E8F0',
  outlineFocus: '#0F172A',
  shadow: '#0F172A',
  placeholder: '#94A3B8',
  success: '#10B981',
  danger: '#EF4444',
  error: '#EF4444',

  // Minimalist Frosted Glass Tokens
  liquidBaseBg: '#F8FAFC',
  liquidGlassBg: 'rgba(255, 255, 255, 0.85)',
  liquidGlassCardBg: 'rgba(255, 255, 255, 0.90)',
  liquidGlassBorder: '#E2E8F0',
  liquidGlassBorderReflective: '#CBD5E1',
  liquidGlassBorderSubtle: '#F1F5F9',
  liquidGlassHighlight: 'rgba(255, 255, 255, 0.95)',
  liquidGlassNavbarBg: 'rgba(255, 255, 255, 0.92)',
  liquidGlassInputBg: '#F8FAFC',
  liquidGlassPillBg: '#F1F5F9',
  liquidGlassShadow: 'rgba(15, 23, 42, 0.05)',
  liquidGlowTurquoise: 'rgba(16, 185, 129, 0.15)',

  // Legacy compatibility tokens
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassCardBg: '#FFFFFF',
  glassBorder: '#E2E8F0',
  glassBorderSubtle: '#F1F5F9',
  glassHighlight: '#FFFFFF',
  glassNavbarBg: 'rgba(255, 255, 255, 0.92)',
  glassInputBg: '#F8FAFC',
  glassPillBg: '#F1F5F9',
  glassShadow: 'rgba(15, 23, 42, 0.05)',

  orb1: 'transparent',
  orb2: 'transparent',
  orb3: 'transparent',
  orb4: 'transparent',
  bgGradient: ['#F8FAFC', '#F1F5F9'] as const,
};

export const darkColors = {
  // Brand & Accents
  primary: '#38BDF8', // Luminous clean Sky
  primaryContainer: 'rgba(56, 189, 248, 0.12)',
  secondary: '#34D399', // Mint / Emerald
  secondaryContainer: 'rgba(52, 211, 153, 0.12)',
  tertiary: '#818CF8', // Indigo
  tertiaryContainer: 'rgba(129, 140, 248, 0.12)',
  accent: '#38BDF8',

  // Surfaces & Backgrounds
  background: '#090D14', // Deep Obsidian Black
  surface: '#111622', // Clean Slate Card
  surfaceVariant: '#171E2D', // Slightly elevated surface
  card: '#111622',
  cardBorder: 'rgba(255, 255, 255, 0.08)', // Delicate 1px separator

  // Text & Typography
  onPrimary: '#090D14',
  onPrimaryContainer: '#BAE6FD',
  onSecondary: '#090D14',
  onSecondaryContainer: '#A7F3D0',
  onTertiary: '#090D14',
  onTertiaryContainer: '#C7D2FE',
  onSurface: '#F8FAFC', // Pure readable off-white
  onSurfaceVariant: '#94A3B8', // Muted slate text
  onError: '#FFFFFF',

  // Interactive & Feedback
  outline: 'rgba(255, 255, 255, 0.08)',
  outlineFocus: '#38BDF8',
  shadow: '#000000',
  placeholder: '#64748B',
  success: '#34D399',
  danger: '#F87171',
  error: '#F87171',

  // Minimalist Frosted Glass Tokens
  liquidBaseBg: '#090D14',
  liquidGlassBg: 'rgba(17, 22, 34, 0.85)',
  liquidGlassCardBg: 'rgba(17, 22, 34, 0.88)',
  liquidGlassBorder: 'rgba(255, 255, 255, 0.08)',
  liquidGlassBorderReflective: 'rgba(255, 255, 255, 0.14)',
  liquidGlassBorderSubtle: 'rgba(255, 255, 255, 0.05)',
  liquidGlassHighlight: 'rgba(255, 255, 255, 0.08)',
  liquidGlassNavbarBg: 'rgba(13, 17, 26, 0.90)',
  liquidGlassInputBg: 'rgba(17, 22, 34, 0.70)',
  liquidGlassPillBg: 'rgba(23, 30, 45, 0.70)',
  liquidGlassShadow: 'rgba(0, 0, 0, 0.40)',
  liquidGlowTurquoise: 'rgba(56, 189, 248, 0.15)',

  // Legacy compatibility tokens
  glassBg: 'rgba(17, 22, 34, 0.85)',
  glassCardBg: '#111622',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.05)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',
  glassNavbarBg: 'rgba(13, 17, 26, 0.90)',
  glassInputBg: 'rgba(17, 22, 34, 0.70)',
  glassPillBg: 'rgba(23, 30, 45, 0.70)',
  glassShadow: 'rgba(0, 0, 0, 0.40)',

  orb1: 'transparent',
  orb2: 'transparent',
  orb3: 'transparent',
  orb4: 'transparent',
  bgGradient: ['#090D14', '#0F1522'] as const,
};

const colors = lightColors;
export default colors;