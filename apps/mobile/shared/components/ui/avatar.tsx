import { UsersRound } from 'lucide-react-native';
import { View } from 'react-native';
import { avatarColors, hueFromString, ONLINE_DOT, useThemeColors } from '@/shared/theme';
import { Text } from './text';
import type { AvatarProps } from './types';

// Initials avatar with a cohesive per-person OKLCH colour (handoff §5).
function Avatar({
  initials,
  hue,
  name,
  size = 40,
  online = false,
  group = false,
  shape = 'round',
}: AvatarProps) {
  const colors = useThemeColors();
  const resolvedHue = hue ?? hueFromString(name ?? initials);
  const { background, foreground } = avatarColors(resolvedHue);
  const radius = shape === 'square' ? size * 0.3 : size / 2;

  return (
    <View style={{ width: size, height: size }} className="shrink-0">
      <View
        className="h-full w-full items-center justify-center"
        style={{ backgroundColor: background, borderRadius: radius }}
      >
        <Text
          className="font-sans-bold"
          style={{ color: foreground, fontSize: size * 0.4, lineHeight: size * 0.46 }}
        >
          {initials}
        </Text>
      </View>

      {online ? (
        <View
          className="absolute"
          style={{
            right: -1,
            bottom: -1,
            width: Math.max(11, size * 0.3),
            height: Math.max(11, size * 0.3),
            borderRadius: 9999,
            backgroundColor: ONLINE_DOT,
            borderWidth: 2.5,
            borderColor: colors.card,
          }}
        />
      ) : null}

      {group ? (
        <View
          className="absolute items-center justify-center bg-primary"
          style={{
            right: -3,
            bottom: -3,
            width: Math.max(17, size * 0.42),
            height: Math.max(17, size * 0.42),
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: colors.card,
          }}
        >
          <UsersRound size={Math.max(9, size * 0.22)} color={colors.primaryForeground} />
        </View>
      ) : null}
    </View>
  );
}

export { Avatar };
