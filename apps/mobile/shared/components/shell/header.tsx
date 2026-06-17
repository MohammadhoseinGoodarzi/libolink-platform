import { useDictionary } from '@repo/i18n';
import { useSetAtom } from 'jotai';
import { ArrowLeft, Menu } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { drawerOpenAtom } from '@/shared/store/ui';
import { useThemeColors } from '@/shared/theme';
import { BrandLogo } from '../brand-logo';
import { ProChip } from '../ui/badges';
import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';

type HeaderProps = {
  /** Right-side contextual actions (search, compose, gear, Premium pill, …). */
  right?: ReactNode;
  /** Centered title instead of the brand lockup (e.g. "Saved"). */
  title?: string;
  /** Small PRO chip after the logo (handoff §5 social header). */
  showProChip?: boolean;
  /** Back chevron instead of the hamburger. */
  showBack?: boolean;
  onBack?: (() => void) | undefined;
};

// App-wide header (handoff §5): hamburger · centered logo/title · right actions.
// The hamburger opens the shared left drawer.
function Header({ right, title, showProChip = false, showBack = false, onBack }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const openDrawer = useSetAtom(drawerOpenAtom);
  const tCommon = useDictionary('Common');
  const tShell = useDictionary('Shell');

  return (
    <View style={{ paddingTop: insets.top }} className="border-border border-b bg-background">
      <View className="h-14 flex-row items-center justify-between px-2">
        <View className="min-w-11 flex-row items-center">
          {showBack ? (
            <IconButton accessibilityLabel={tCommon('back')} onPress={onBack}>
              <ArrowLeft size={24} color={colors.primary} />
            </IconButton>
          ) : (
            <IconButton accessibilityLabel={tShell('openMenu')} onPress={() => openDrawer(true)}>
              <Menu size={22} color={colors.primary} />
            </IconButton>
          )}
        </View>

        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center">
          <View className="flex-row items-center gap-2">
            {title ? (
              <Text className="font-sans-bold text-[17px] text-foreground">{title}</Text>
            ) : (
              <BrandLogo height={24} />
            )}
            {showProChip ? <ProChip /> : null}
          </View>
        </View>

        <View className="min-w-11 flex-row items-center justify-end">{right}</View>
      </View>
    </View>
  );
}

export { Header };
