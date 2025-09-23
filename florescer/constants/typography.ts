// florescer/constants/typography.ts

import { TextStyle } from 'react-native';

const typography = {
  displayLarge: {
    fontFamily: 'Lato-Regular',
    fontSize: 57,
    fontWeight: '400',
    lineHeight: 64,
  } as TextStyle,
  // ... (outros estilos com 'Lato-Regular' para pesos normais)
  headlineLarge: {
    fontFamily: 'Lato-Regular',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 40,
  } as TextStyle,
  titleMedium: {
    fontFamily: 'Lato-Bold', // Usando a fonte em negrito
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,
  titleSmall: {
    fontFamily: 'Lato-Bold', // Usando a fonte em negrito
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  labelLarge: {
    fontFamily: 'Lato-Bold', // Usando a fonte em negrito
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  // ... (outros estilos com 'Lato-Bold' para pesos maiores)
  bodyLarge: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,
  bodyMedium: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,
};

// Para facilitar, aqui está o arquivo completo para você copiar e colar:
const fullTypography = {
  displayLarge: { fontFamily: 'Lato-Regular', fontSize: 57, fontWeight: '400', lineHeight: 64 } as TextStyle,
  displayMedium: { fontFamily: 'Lato-Regular', fontSize: 45, fontWeight: '400', lineHeight: 52 } as TextStyle,
  displaySmall: { fontFamily: 'Lato-Regular', fontSize: 36, fontWeight: '400', lineHeight: 44 } as TextStyle,
  headlineLarge: { fontFamily: 'Lato-Regular', fontSize: 32, fontWeight: '400', lineHeight: 40 } as TextStyle,
  headlineMedium: { fontFamily: 'Lato-Regular', fontSize: 28, fontWeight: '400', lineHeight: 36 } as TextStyle,
  headlineSmall: { fontFamily: 'Lato-Regular', fontSize: 24, fontWeight: '400', lineHeight: 32 } as TextStyle,
  titleLarge: { fontFamily: 'Lato-Regular', fontSize: 22, fontWeight: '400', lineHeight: 28 } as TextStyle,
  titleMedium: { fontFamily: 'Lato-Bold', fontSize: 16, fontWeight: 'normal', lineHeight: 24, letterSpacing: 0.15 } as TextStyle,
  titleSmall: { fontFamily: 'Lato-Bold', fontSize: 14, fontWeight: 'normal', lineHeight: 20, letterSpacing: 0.1 } as TextStyle,
  labelLarge: { fontFamily: 'Lato-Bold', fontSize: 14, fontWeight: 'normal', lineHeight: 20, letterSpacing: 0.1 } as TextStyle,
  labelMedium: { fontFamily: 'Lato-Bold', fontSize: 12, fontWeight: 'normal', lineHeight: 16, letterSpacing: 0.5 } as TextStyle,
  labelSmall: { fontFamily: 'Lato-Bold', fontSize: 11, fontWeight: 'normal', lineHeight: 16, letterSpacing: 0.5 } as TextStyle,
  bodyLarge: { fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.5 } as TextStyle,
  bodyMedium: { fontFamily: 'Lato-Regular', fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: 0.25 } as TextStyle,
  bodySmall: { fontFamily: 'Lato-Regular', fontSize: 12, fontWeight: '400', lineHeight: 16, letterSpacing: 0.4 } as TextStyle,
};

export default fullTypography;