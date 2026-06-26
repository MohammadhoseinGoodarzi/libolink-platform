import { type MessageKey, useDictionary } from '@repo/i18n';
import type { ComparisonValue } from '@repo/types';
import { cn } from '@repo/utils';
import { Check, Crown, Minus } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { CompareTableProps } from '../types';

// Free vs Premium comparison (handoff Subscription): a three-column table.
function CompareTable({ rows }: CompareTableProps) {
  const t = useDictionary('Subscription');
  const colors = useThemeColors();

  const renderCell = (value: ComparisonValue, pro: boolean) => {
    if (value === true) {
      return (
        <View
          className={cn(
            'h-6 w-6 items-center justify-center rounded-full',
            pro ? 'bg-primary' : 'bg-secondary',
          )}
        >
          <Check size={14} color={pro ? colors.primaryForeground : colors.primary} />
        </View>
      );
    }
    if (value === false) {
      return <Minus size={18} color={colors.mutedForeground} />;
    }
    return (
      <Text
        className={cn(
          'text-[12.5px]',
          pro ? 'font-sans-bold text-primary' : 'font-sans-medium text-muted-foreground',
        )}
      >
        {t(value === 'unlimited' ? 'unlimited' : 'limited')}
      </Text>
    );
  };

  return (
    <Card className="mx-4 mt-3.5 overflow-hidden">
      <View className="flex-row items-center border-border border-b px-4 py-3">
        <View className="flex-1" />
        <Text className="w-16 text-center font-sans-semibold text-[12.5px] text-muted-foreground">
          {t('free')}
        </Text>
        <View className="w-[78px] flex-row items-center justify-center gap-1">
          <Crown size={14} color={colors.primary} />
          <Text className="font-sans-bold text-[12.5px] text-primary">{t('premium')}</Text>
        </View>
      </View>
      {rows.map((row, index) => (
        <View
          key={row.key}
          className={cn('flex-row items-center px-4 py-3', index > 0 && 'border-border border-t')}
        >
          {/* row.key is authored to match a Subscription i18n key. */}
          <Text className="flex-1 font-sans text-[13.5px] text-foreground">
            {t(row.key as MessageKey<'Subscription'>)}
          </Text>
          <View className="w-16 items-center">{renderCell(row.free, false)}</View>
          <View className="w-[78px] items-center">{renderCell(row.pro, true)}</View>
        </View>
      ))}
    </Card>
  );
}

export { CompareTable };
