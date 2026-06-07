// src/providers/ThemeProvider.tsx
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { useThemeStore } from '@/store/ui';

export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      value={{
        light: 'light',
        dark: 'dark',
      }}
      enableSystem
      forcedTheme={theme}
      onChangeTheme={(newTheme) => setTheme(newTheme)}
    >
      {children}
    </ThemeProvider>
  );
}
