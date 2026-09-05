import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  cardBg: string;
  subPanel: string;
  border: string;
  borderSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  steelBlue: string;
  darkSlate: string;
  slateGray: string;
  taupe: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  success: string;
  successBg: string;
  successBorder: string;
  inputBg: string;
}

export const URBAN_SLATE_LIGHT: ThemeColors = {
  bg: '#E9E6E7',
  cardBg: '#ffffff',
  subPanel: '#FAF9F9',
  border: '#DCD7D8',
  borderSoft: '#E9E6E7',
  textPrimary: '#2C2827',
  textSecondary: '#5E5653',
  textMuted: '#7B7F8A',
  steelBlue: '#6B7C98',
  darkSlate: '#5E5653',
  slateGray: '#7B7F8A',
  taupe: '#AB978C',
  danger: '#B84A4A',
  dangerBg: '#F8ECEC',
  dangerBorder: '#D89696',
  warning: '#C28B52',
  warningBg: '#FAF2EA',
  warningBorder: '#E0BA92',
  success: '#4D8067',
  successBg: '#EEF5F1',
  successBorder: '#A3C7B5',
  inputBg: '#FAF9F9',
};

export const URBAN_SLATE_DARK: ThemeColors = {
  bg: '#1C1918',
  cardBg: '#2A2624',
  subPanel: '#35302E',
  border: '#46403D',
  borderSoft: '#35302E',
  textPrimary: '#F2EFEF',
  textSecondary: '#D0CAC7',
  textMuted: '#9E9793',
  steelBlue: '#8496B3',
  darkSlate: '#D0CAC7',
  slateGray: '#9E9793',
  taupe: '#C4B4AA',
  danger: '#E06D6D',
  dangerBg: '#3E2222',
  dangerBorder: '#753535',
  warning: '#DDA873',
  warningBg: '#3D2F23',
  warningBorder: '#7A5B3D',
  success: '#6AA88B',
  successBg: '#22382E',
  successBorder: '#3C6652',
  inputBg: '#35302E',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: URBAN_SLATE_LIGHT,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const colors = isDark ? URBAN_SLATE_DARK : URBAN_SLATE_LIGHT;

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
