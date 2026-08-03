import { ReactNode } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0B5FFF',
    secondary: '#0F172A',
    surface: '#FFFFFF',
    background: '#F4F6F8',
  },
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
