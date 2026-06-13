import { themeAtom } from '@repo/stores';
import { useSetAtom } from 'jotai';
import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

// NativeWind owns the actual color scheme; themeAtom mirrors it into the shared
// store so non-UI code (and the web app's equivalent) observes one source.
export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#fafafa' : '#171717';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={() => {
        toggleColorScheme();
        setTheme(isDark ? 'light' : 'dark');
      }}
      className="h-9 w-9 items-center justify-center rounded-md"
    >
      {isDark ? <Sun size={20} color={iconColor} /> : <Moon size={20} color={iconColor} />}
    </Pressable>
  );
}
