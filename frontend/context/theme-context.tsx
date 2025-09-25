import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from '@/hooks/useColorScheme';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const STORAGE_KEY = 'preferredColorScheme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const system = (useSystemColorScheme() ?? 'light') as ThemeMode;
  const [theme, setThemeState] = useState<ThemeMode>(system);

  useEffect(() => {
    // load saved preference (if any) and fall back to system
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (!mounted) return;
        if (v === 'light' || v === 'dark') setThemeState(v as ThemeMode);
        else setThemeState(system);
      })
      .catch(() => {
        if (mounted) setThemeState(system);
      });

    return () => {
      mounted = false;
    };
  }, [system]);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, t);
    } catch (e) {
      // ignore
    }
  };

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    await setTheme(next);
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within a ThemeProviderWrapper');
  return ctx;
}

export async function getSavedTheme(): Promise<ThemeMode | null> {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v as ThemeMode;
  } catch (e) {}
  return null;
}
