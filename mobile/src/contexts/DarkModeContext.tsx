import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}

interface DarkModeProviderProps {
  children: ReactNode;
}

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDarkMode();
  }, []);

  const loadDarkMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('darkMode');
      if (savedMode !== null) {
        setIsDark(savedMode === 'true');
      } else {
        // Use system preference if no saved preference
        const systemColorScheme = Appearance.getColorScheme();
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading dark mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('darkMode', String(newMode));
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}


