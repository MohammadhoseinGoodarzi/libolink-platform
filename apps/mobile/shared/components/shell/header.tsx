import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeft, Menu } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { drawerOpenAtom } from '@/shared/store/ui';
import { useThemeColors } from '@/shared/theme';
import { BrandLogo } from '../brand-logo';
import { ProChip } from '../ui/badges';
import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';
import type { HeaderProps } from './types';

// App-wide header (handoff §5): hamburger · centered logo/title · right actions.
// The hamburger opens the shared left drawer.
function Header({ right, title, showBack = false, onBack }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const openDrawer = useSetAtom(drawerOpenAtom);
  const tCommon = useDictionary('Common');
  const tShell = useDictionary('Shell');
  // Premium users get the PRO badge beside the logo — the header half of the
  // app's two modes (normal vs premium). Only shown with the brand lockup.
  const user = useAtomValue(userAtom);
  const showProChip = !title && (user?.isPremium ?? false);

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

        {/* Logo sits dead-centre on every screen, alone. The PRO badge floats to
            its left (absolutely positioned) so it never shifts the logo off-centre.
            pointerEvents=box-none lets taps fall through to the buttons beneath. */}
        <View pointerEvents="box-none" className="absolute inset-0 items-center justify-center">
          <View className="items-center justify-center">
            {title ? (
              <Text numberOfLines={1} className="font-sans-bold text-[17px] text-foreground">
                {title}
              </Text>
            ) : (
              <BrandLogo height={24} />
            )}
            {showProChip ? (
              <View
                className="absolute justify-center"
                style={{ right: '100%', top: 0, bottom: 0, paddingRight: 8 }}
              >
                <ProChip />
              </View>
            ) : null}
          </View>
        </View>

        <View className="min-w-11 flex-row items-center justify-end">{right}</View>
      </View>
    </View>
  );
}

export { Header };
