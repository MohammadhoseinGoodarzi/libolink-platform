import { View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SettingsGroupLabelProps } from '../types';

// Uppercase section label above a GroupCard (handoff Settings kit), with an
// optional leading icon.
function SettingsGroupLabel({ children, icon: Icon }: SettingsGroupLabelProps) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-2 px-5 pb-2">
      {Icon ? <Icon size={15} color={colors.primary} /> : null}
      <Text
        className="font-sans-bold text-[12.5px] text-muted-foreground uppercase"
        style={{ letterSpacing: 0.6 }}
      >
        {children}
      </Text>
    </View>
  );
}

export { SettingsGroupLabel };
