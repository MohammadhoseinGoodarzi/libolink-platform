import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SectionProps } from '../types';

// Shared section header + body (handoff §6.4): leading icon, title + optional
// sub, and a trailing chevron action. Every profile section is wrapped in one.
function Section({
  title,
  sub,
  icon: Icon,
  action,
  onAction,
  first = false,
  children,
}: SectionProps) {
  const colors = useThemeColors();
  return (
    <View className={first ? 'pt-1.5' : 'pt-5'}>
      <View className="flex-row items-end justify-between gap-3 px-4 pb-2.5">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          {Icon ? <Icon size={18} color={colors.primary} /> : null}
          <View className="min-w-0 flex-1">
            <Text className="font-sans-bold text-[18px] text-foreground">{title}</Text>
            {sub ? (
              <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">{sub}</Text>
            ) : null}
          </View>
        </View>
        {action ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            className="flex-row items-center gap-0.5 active:opacity-60"
          >
            <Text className="font-sans-semibold text-[13.5px] text-link">{action}</Text>
            <ChevronRight size={15} color={colors.link} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export { Section };
