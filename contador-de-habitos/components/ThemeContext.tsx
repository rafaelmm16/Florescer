import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import typography from '../constants/typography';
import { darkColors, lightColors } from '../constants/colors';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors, // Mantém todas as cores padrão (incluindo elevation)
    ...lightColors,         // Sobrescreve e adiciona nossas cores customizadas
  },
  fonts: typography,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors, // Mantém todas as cores padrão (incluindo elevation)
    ...darkColors,          // Sobrescreve e adiciona nossas cores customizadas
  },
  fonts: typography,
};

interface ThemeContextProps {
  isDark: boolean;
  theme: typeof lightTheme | typeof darkTheme;
  toggleTheme: () => void;
}

// @ts-ignore
const ThemeContext = createContext<ThemeContextProps>();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
      }
    };

    loadTheme();
  }, []);

  const currentTheme = isDark ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    try {
      await AsyncStorage.setItem('theme', !isDark ? 'dark' : 'light');
      setIsDark(prev => !prev);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  return (
    <PaperProvider theme={currentTheme}>
      <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </PaperProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}