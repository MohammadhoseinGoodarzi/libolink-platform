import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { cn } from '@repo/utils';
import { usePathname, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Home, MessageCircle, Sparkles, UsersRound } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lioOpenAtom } from '@/shared/store/ui';
import { useThemeColors } from '@/shared/theme';
import { Avatar } from '../ui/avatar';
import { BrandGradient } from '../ui/brand-gradient';
import { Text } from '../ui/text';
import type { Tab } from './types';

// Home · Messages · [AI center] · Clubs · Profile (handoff §5). Friends is in
// the drawer, not here. The centre AI button opens Lio (it is not a route).
const LEFT_TABS: Tab[] = [
  { key: 'home', labelKey: 'tabHome', route: '/home', icon: Home },
  { key: 'messages', labelKey: 'tabMessages', route: '/messages', icon: MessageCircle },
];
const RIGHT_TABS: Tab[] = [
  { key: 'clubs', labelKey: 'tabClubs', route: '/clubs', icon: UsersRound },
  { key: 'profile', labelKey: 'tabProfile', route: '/profile', avatar: true },
];

function initialsOf(name: string | undefined): string {
  if (!name) {
    return 'YOU';
  }
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'YOU';
}

// Self-contained custom tab bar: drives Expo Router via usePathname/useRouter
// (no React Navigation). Pass to <Tabs tabBar={() => <BottomTabBar />} />.
export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const pathname = usePathname();
  const router = useRouter();
  const openLio = useSetAtom(lioOpenAtom);
  const user = useAtomValue(userAtom);
  const t = useDictionary('Shell');

  const renderTab = (tab: Tab) => {
    const active = pathname === tab.route || pathname.startsWith(`${tab.route}/`);
    const color = active ? colors.primary : colors.mutedForeground;
    return (
      <Pressable
        key={tab.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={t(tab.labelKey)}
        onPress={() => router.navigate(tab.route as never)}
        className="w-16 items-center gap-0.5 py-1 active:opacity-60"
      >
        {tab.avatar ? (
          <View
            className={cn('rounded-full', active && 'border-2 border-primary p-0.5')}
            style={!active ? { padding: 2 } : undefined}
          >
            <Avatar initials={initialsOf(user?.displayName)} name={user?.displayName} size={24} />
          </View>
        ) : tab.icon ? (
          <tab.icon size={24} color={color} fill={active ? color : 'transparent'} />
        ) : null}
        <Text
          style={{ color }}
          className={cn('text-[10px]', active ? 'font-sans-bold' : 'font-sans-medium')}
        >
          {t(tab.labelKey)}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{ paddingBottom: insets.bottom }} className="border-border border-t bg-background">
      <View className="flex-row items-end justify-around px-1.5 pt-1.5 pb-1">
        {LEFT_TABS.map(renderTab)}

        {/* raised AI center — opens Lio, not a route */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('tabAi')}
          onPress={() => openLio(true)}
          // No fixed width here (unlike the side tabs): the "AI Assistant" label
          // is two words, so let the tab size to its content and keep it on one
          // line instead of wrapping inside a 64px slot.
          className="items-center gap-0.5 px-1 active:opacity-60"
        >
          <BrandGradient
            className="-mt-3.5 h-12 w-12 items-center justify-center rounded-full"
            style={{
              shadowColor: '#023618',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </BrandGradient>
          <Text
            numberOfLines={1}
            className="-mt-1 font-sans-medium text-[10px] text-muted-foreground"
          >
            {t('tabAi')}
          </Text>
        </Pressable>

        {RIGHT_TABS.map(renderTab)}
      </View>
    </View>
  );
}
