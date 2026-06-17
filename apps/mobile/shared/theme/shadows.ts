import { useColorScheme } from 'nativewind';
import type { ViewStyle } from 'react-native';

// Soft, green-tinted shadows only (handoff §3.7 / §7). No harsh black drops.
// Dark mode drops shadows entirely (matches the prototype) — they read as noise
// on the forest-black canvas.
export const SHADOWS = {
  card: {
    shadowColor: '#023618',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  lifted: {
    shadowColor: '#023618',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
} satisfies Record<string, ViewStyle>;

export function useShadow(level: keyof typeof SHADOWS = 'card'): ViewStyle {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? {} : SHADOWS[level];
}
