import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', 
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        console.log(newTheme)
      },
    }),
    {
      name: 'theme-storage', 
    }
  )
);

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme };
};
