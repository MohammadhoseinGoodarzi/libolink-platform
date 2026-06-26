import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { FriendsSectionProps } from '../types';

// Section header (handoff Friends): title + quiet subtitle + an optional See-all.
function FriendsSection({ title, sub, action, onAction, first, children }: FriendsSectionProps) {
  const colors = useThemeColors();
  return (
    <View className={first ? 'pt-1' : ''}>
      <View className="flex-row items-baseline justify-between gap-3 px-5 pt-6 pb-3">
        <View className="min-w-0 flex-1">
          <Text className="font-sans-bold text-[19px] text-foreground">{title}</Text>
          {sub ? (
            <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">{sub}</Text>
          ) : null}
        </View>
        {action ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            className="flex-row items-center"
          >
            <Text className="font-sans-semibold text-[13.5px] text-primary">{action}</Text>
            <ChevronRight size={15} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export { FriendsSection };
