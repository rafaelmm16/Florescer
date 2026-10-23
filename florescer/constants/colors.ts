export const lightColors = {
  primary: '#0891B2', // Vibrant Turquoise / Cyan 600
  primaryContainer: '#CFFAFE', // Cyan 100
  secondary: '#0D9488', // Teal 600
  secondaryContainer: '#CCFBF1', // Teal 100
  tertiary: '#0284C7', // Sky 600
  tertiaryContainer: '#E0F2FE', // Sky 100
  accent: '#06B6D4', // Vibrant Cyan / Turquoise 500
  surface: '#FFFFFF',
  surfaceVariant: '#F0FDFA', // Mint/Ice 50
  background: '#F0FDFA', // Crisp Ice Turquoise
  card: '#FFFFFF',
  cardBorder: 'rgba(6, 182, 212, 0.15)',
  error: '#EF4444', // Red 500
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#164E63', // Cyan 900
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#134E4A',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#0C4A6E',
  onSurface: '#082F49', // Deep Ocean Slate
  onSurfaceVariant: '#0E7490', // Teal Slate
  onError: '#FFFFFF',
  outline: 'rgba(6, 182, 212, 0.20)',
  outlineFocus: '#06B6D4',
  shadow: '#082F49',
  placeholder: '#94A3B8',
  success: '#0D9488',
  danger: '#EF4444',

  // Liquid Glass & Frosted Glass Design Tokens (Light Mode)
  liquidBaseBg: '#F0FDFA',
  liquidGlassBg: 'rgba(255, 255, 255, 0.82)',
  liquidGlassCardBg: 'rgba(255, 255, 255, 0.84)',
  liquidGlassBorder: 'rgba(255, 255, 255, 0.90)',
  liquidGlassBorderReflective: 'rgba(6, 182, 212, 0.30)',
  liquidGlassBorderSubtle: 'rgba(6, 182, 212, 0.15)',
  liquidGlassHighlight: 'rgba(255, 255, 255, 0.85)',
  liquidGlassNavbarBg: 'rgba(255, 255, 255, 0.88)',
  liquidGlassInputBg: 'rgba(255, 255, 255, 0.78)',
  liquidGlassPillBg: 'rgba(255, 255, 255, 0.82)',
  liquidGlassShadow: 'rgba(8, 47, 73, 0.08)',
  liquidGlowTurquoise: 'rgba(6, 182, 212, 0.35)',

  // Legacy compatibility tokens
  glassBg: 'rgba(255, 255, 255, 0.82)',
  glassCardBg: 'rgba(255, 255, 255, 0.84)',
  glassBorder: 'rgba(255, 255, 255, 0.90)',
  glassBorderSubtle: 'rgba(6, 182, 212, 0.15)',
  glassHighlight: 'rgba(255, 255, 255, 0.85)',
  glassNavbarBg: 'rgba(255, 255, 255, 0.88)',
  glassInputBg: 'rgba(255, 255, 255, 0.78)',
  glassPillBg: 'rgba(255, 255, 255, 0.82)',
  glassShadow: 'rgba(8, 47, 73, 0.08)',
  
  // Clean Background
  orb1: 'transparent',
  orb2: 'transparent',
  orb3: 'transparent',
  orb4: 'transparent',
  bgGradient: ['#F0FDFA', '#E0F2FE'] as const,
};

export const darkColors = {
  primary: '#00F2FE', // Luminous Electric Turquoise
  primaryContainer: 'rgba(0, 242, 254, 0.18)', // Turquoise glow container
  secondary: '#2DD4BF', // Bright Seafoam Teal
  secondaryContainer: 'rgba(45, 212, 191, 0.18)',
  tertiary: '#38BDF8', // Azure Sky
  tertiaryContainer: 'rgba(56, 189, 248, 0.18)',
  accent: '#06B6D4', // Vibrant Turquoise
  surface: '#0A1D2E', // Deep Oceanic Midnight Slate
  surfaceVariant: '#0E283C', // Layered Oceanic Glass Slab
  background: '#05131E', // Deep Oceanic Midnight Abyss Base
  card: '#0A1D2E',
  cardBorder: 'rgba(0, 242, 254, 0.22)',
  error: '#F87171',
  onPrimary: '#05131E',
  onPrimaryContainer: '#A5F3FC',
  onSecondary: '#05131E',
  onSecondaryContainer: '#99F6E4',
  onTertiary: '#05131E',
  onTertiaryContainer: '#BAE6FD',
  onSurface: '#F0FDFA', // Crisp Diamond White-Turquoise
  onSurfaceVariant: '#93C5FD', // Soft Sky Mist
  onError: '#FFFFFF',
  outline: 'rgba(0, 242, 254, 0.22)',
  outlineFocus: '#00F2FE',
  shadow: '#020B12',
  placeholder: '#64748B',
  success: '#2DD4BF',
  danger: '#F87171',

  // Liquid Glass & Frosted Glass Design Tokens (Dark Mode)
  liquidBaseBg: '#05131E',
  liquidGlassBg: 'rgba(10, 29, 46, 0.72)',
  liquidGlassCardBg: 'rgba(10, 29, 46, 0.74)',
  liquidGlassBorder: 'rgba(0, 242, 254, 0.25)',
  liquidGlassBorderReflective: 'rgba(0, 242, 254, 0.35)',
  liquidGlassBorderSubtle: 'rgba(255, 255, 255, 0.10)',
  liquidGlassHighlight: 'rgba(255, 255, 255, 0.16)',
  liquidGlassNavbarBg: 'rgba(7, 21, 33, 0.82)',
  liquidGlassInputBg: 'rgba(5, 17, 28, 0.70)',
  liquidGlassPillBg: 'rgba(14, 40, 60, 0.75)',
  liquidGlassShadow: 'rgba(0, 0, 0, 0.55)',
  liquidGlowTurquoise: 'rgba(0, 242, 254, 0.45)',

  // Legacy compatibility tokens
  glassBg: 'rgba(10, 29, 46, 0.72)',
  glassCardBg: 'rgba(10, 29, 46, 0.74)',
  glassBorder: 'rgba(0, 242, 254, 0.25)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.10)',
  glassHighlight: 'rgba(255, 255, 255, 0.16)',
  glassNavbarBg: 'rgba(7, 21, 33, 0.82)',
  glassInputBg: 'rgba(5, 17, 28, 0.70)',
  glassPillBg: 'rgba(14, 40, 60, 0.75)',
  glassShadow: 'rgba(0, 0, 0, 0.55)',
  
  // Clean Background (Dark Mode)
  orb1: 'transparent',
  orb2: 'transparent',
  orb3: 'transparent',
  orb4: 'transparent',
  bgGradient: ['#05131E', '#0A1D2E'] as const,
};

const colors = lightColors;
export default colors;