import { Moon, Sun } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useAppTheme } from '@/shared/theme';

// Writes through useAppTheme so the choice persists (AsyncStorage) and mirrors
// into themeAtom. Lives in the left drawer per the handoff (§5).
export function ThemeToggle() {
  const { isDark, toggle } = useAppTheme();
  const iconColor = isDark ? '#fafafa' : '#171717';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={toggle}
      className="h-9 w-9 items-center justify-center rounded-full"
    >
      {isDark ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
    </Pressable>
  );
}
