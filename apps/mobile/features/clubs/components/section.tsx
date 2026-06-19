import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ClubsSectionProps } from '../types';

// Clubs section header + body (handoff §6.5): title + quiet subtitle, optional
// "See all" chevron action in brand green.
function ClubsSection({
  title,
  sub,
  action,
  onAction,
  first = false,
  children,
}: ClubsSectionProps) {
  const colors = useThemeColors();
  return (
    <View className={first ? 'pt-1' : 'pt-1.5'}>
      <View className="flex-row items-baseline justify-between gap-3 px-[18px] pt-6 pb-3">
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
            className="flex-row items-center gap-0.5 active:opacity-60"
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

export { ClubsSection };
