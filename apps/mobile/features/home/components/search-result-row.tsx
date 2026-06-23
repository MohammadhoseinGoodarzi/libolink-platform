import { ChevronRight, Hash } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SearchResultRowProps } from '../types';

// One search result: a person (avatar · name · @handle + mutual) or a tag
// (# tile · tag · post count), with a trailing chevron.
export function SearchResultRow({ result, onPress }: SearchResultRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 border-border border-b px-4 py-3 active:opacity-70"
    >
      {result.kind === 'tag' ? (
        <View className="h-11 w-11 items-center justify-center rounded-sm bg-secondary">
          <Hash size={20} color={colors.primary} />
        </View>
      ) : (
        <Avatar
          initials={result.initials}
          name={result.name}
          hue={result.hue}
          size={44}
          shape={result.kind === 'club' ? 'square' : 'round'}
        />
      )}

      <View className="min-w-0 flex-1">
        {result.kind === 'person' ? (
          <>
            <Text className="font-sans-bold text-[14.5px] text-foreground" numberOfLines={1}>
              {result.name}
            </Text>
            <Text className="font-sans text-[12px] text-muted-foreground" numberOfLines={1}>
              @{result.username}
              {result.mutual ? ` · ${result.mutual}` : ''}
            </Text>
          </>
        ) : result.kind === 'club' ? (
          <>
            <Text className="font-sans-bold text-[14.5px] text-foreground" numberOfLines={1}>
              {result.name}
            </Text>
            <Text className="font-sans text-[12px] text-muted-foreground" numberOfLines={1}>
              {result.category} · {result.members}
            </Text>
          </>
        ) : (
          <>
            <Text className="font-sans-bold text-[14.5px] text-foreground" numberOfLines={1}>
              {result.tag}
            </Text>
            <Text className="font-sans text-[12px] text-muted-foreground">{result.posts}</Text>
          </>
        )}
      </View>

      <ChevronRight size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}
