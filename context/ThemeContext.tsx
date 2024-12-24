import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

type Theme = {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    placeholder: string;
  };
};

const lightTheme: Theme = {
  colors: {
    primary: '#1877f2',
    background: '#f0f2f5',
    card: '#ffffff',
    text: '#1c1e21',
    border: '#dddfe2',
    placeholder: '#65676b',
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#1877f2',
    background: '#18191a',
    card: '#242526',
    text: '#e4e6eb',
    border: '#3e4042',
    placeholder: '#b0b3b8',
  },
};

type ThemeContextType = {
  colors: Theme['colors'];
};

const ThemeContext = createContext<ThemeContextType>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 