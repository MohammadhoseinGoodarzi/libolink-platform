import { useColorScheme } from 'nativewind';

// Literal hex for every semantic token, computed from the HSL triplets in
// global.css so they match exactly what NativeWind renders for className colors.
// RN props that cannot read CSS vars — placeholderTextColor, lucide `color`,
// shadowColor, react-native-svg fills — read these via useThemeColors().
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  destructive: string;
  destructiveForeground: string;
  link: string;
  border: string;
  ring: string;
  /** Overlay scrim behind sheets/drawers (a color, not element opacity). */
  scrim: string;
}

export const LIGHT_COLORS: ThemeColors = {
  background: '#F1EDE4',
  foreground: '#0E1A13',
  card: '#FFFFFF',
  cardForeground: '#0E1A13',
  primary: '#023618',
  primaryForeground: '#FFFFFF',
  secondary: '#EBE0D1',
  secondaryForeground: '#023618',
  muted: '#EBEBEB',
  mutedForeground: '#6B7280',
  accent: '#EBE0D1',
  destructive: '#C14953',
  destructiveForeground: '#FFFFFF',
  link: '#1D3658',
  border: '#EBEBEB',
  ring: '#023618',
  scrim: 'rgba(15,27,20,0.45)',
} as const;

export const DARK_COLORS: ThemeColors = {
  background: '#101814',
  foreground: '#F4F6F5',
  card: '#1A231F',
  cardForeground: '#F4F6F5',
  primary: '#46916B',
  primaryForeground: '#141414',
  secondary: '#242E29',
  secondaryForeground: '#F4F6F5',
  muted: '#242E29',
  mutedForeground: '#9FA3AD',
  accent: '#28332E',
  destructive: '#D45854',
  destructiveForeground: '#FFFFFF',
  link: '#7E9FCE',
  border: '#343D38',
  ring: '#46916B',
  scrim: 'rgba(0,0,0,0.6)',
} as const;

export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
