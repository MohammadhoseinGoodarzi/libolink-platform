import { cn } from '@repo/utils';
import { BadgeCheck, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';
import { useThemeColors } from '@/shared/theme';
import { Text } from './text';

// Crimson unread/count pill (handoff messages list). Muted conversations pass
// `muted` to swap crimson → gray.
function CountBadge({ count, muted = false }: { count: number; muted?: boolean }) {
  return (
    <View
      className={cn(
        'h-5 min-w-5 items-center justify-center rounded-full px-1.5',
        muted ? 'bg-muted-foreground' : 'bg-destructive',
      )}
    >
      <Text className="font-sans-bold text-[11px] text-destructive-foreground">{count}</Text>
    </View>
  );
}

// Verified reader badge — always brand green (handoff §6.2).
function VerifiedBadge({ size = 16 }: { size?: number }) {
  const colors = useThemeColors();
  return <BadgeCheck size={size} color={colors.primary} fill="transparent" />;
}

// "PRO" chip shown next to the logo / in the drawer (handoff §5, social header).
function ProChip() {
  const colors = useThemeColors();
  return (
    <View className="h-[17px] flex-row items-center gap-0.5 rounded-full bg-secondary px-1.5">
      <Sparkles size={9} color={colors.primary} />
      <Text className="font-sans-bold text-[9.5px] tracking-wider text-primary">PRO</Text>
    </View>
  );
}

export { CountBadge, ProChip, VerifiedBadge };
