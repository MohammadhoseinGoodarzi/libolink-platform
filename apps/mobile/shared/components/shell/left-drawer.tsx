import { useDictionary } from '@repo/i18n';
import { sessionAtom, userAtom } from '@repo/stores';
import { cn } from '@repo/utils';
import { useRouter } from 'expo-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Bookmark,
  ChevronRight,
  CircleHelp,
  X as Close,
  Crown,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '@/shared/constants';
import { drawerOpenAtom } from '@/shared/store/ui';
import { useThemeColors } from '@/shared/theme';
import { BrandLogo } from '../brand-logo';
import { ThemeToggle } from '../theme-toggle';
import { Avatar } from '../ui/avatar';
import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';
import { useToast } from '../ui/toast';
import type { DrawerItem } from './types';

const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const DRAWER_WIDTH = 290;

// Premium first (PRO badge). Friends lives here, not the tab bar (handoff §5).
const DRAWER_ITEMS: DrawerItem[] = [
  {
    key: 'premium',
    labelKey: 'drawerPremium',
    icon: Sparkles,
    badge: 'PRO',
    route: '/subscription',
  },
  {
    key: 'messages',
    labelKey: 'drawerMessages',
    icon: MessageCircle,
    badge: 2,
    route: '/messages',
  },
  { key: 'friends', labelKey: 'drawerFriends', icon: Users, badge: 4, route: '/friends' },
  { key: 'saved', labelKey: 'drawerSaved', icon: Bookmark, route: '/saved' },
  { key: 'settings', labelKey: 'drawerSettings', icon: Settings, route: '/settings' },
  { key: 'help', labelKey: 'drawerHelp', icon: CircleHelp },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'YOU';
}

export function LeftDrawer() {
  const [open, setOpen] = useAtom(drawerOpenAtom);
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const user = useAtomValue(userAtom);
  const setSession = useSetAtom(sessionAtom);
  const t = useDictionary('Shell');
  const isPremium = user?.isPremium ?? false;

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(scrim, { toValue: 1, duration: 220, easing: EASE, useNativeDriver: true }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrim, { toValue: 0, duration: 200, easing: EASE, useNativeDriver: true }),
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 240,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [open, scrim, translateX]);

  if (!mounted) {
    return null;
  }

  const name = user?.displayName ?? t('yourProfile');
  const handle = user?.username ? `@${user.username}` : t('viewProfile');

  const go = (route?: string) => {
    setOpen(false);
    if (route) {
      router.push(route as never);
    } else {
      toast.show(t('helpComingSoon'));
    }
  };

  // Flip the signed-in user between the two app modes (normal ⇄ premium). Premium
  // status lives on the session user, so toggle it there (userAtom is read-only).
  const toggleMode = () => {
    setSession((prev) =>
      prev ? { ...prev, user: { ...prev.user, isPremium: !prev.user.isPremium } } : prev,
    );
    toast.show(isPremium ? t('normalModeOn') : t('premiumModeOn'));
  };

  const logOut = () => {
    setOpen(false);
    setSession(null);
    toast.show(t('signedOut'));
    router.replace(ROUTES.welcome);
  };

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: scrim,
            backgroundColor: colors.scrim,
          }}
        >
          <Pressable
            accessibilityLabel={t('closeMenu')}
            className="flex-1"
            onPress={() => setOpen(false)}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
            backgroundColor: colors.background,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom,
          }}
        >
          <View className="flex-row items-center justify-between px-4 pb-2">
            <BrandLogo height={22} />
            <View className="flex-row items-center">
              <ThemeToggle />
              <IconButton accessibilityLabel={t('closeMenu')} onPress={() => setOpen(false)}>
                <Close size={20} color={colors.foreground} />
              </IconButton>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => go('/profile')}
            className="mx-3 mb-2 flex-row items-center gap-3 rounded-lg bg-primary px-3.5 py-3 active:opacity-60"
          >
            <Avatar initials={initialsOf(name)} name={name} size={42} />
            <View className="flex-1">
              <Text className="font-sans-bold text-sm text-primary-foreground" numberOfLines={1}>
                {name}
              </Text>
              <Text className="text-[11.5px] text-primary-foreground/60" numberOfLines={1}>
                {handle}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.primaryForeground} />
          </Pressable>

          <View className="flex-1 px-3 pt-1">
            {DRAWER_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                onPress={() => go(item.route)}
                className="mb-0.5 h-[46px] flex-row items-center gap-3 rounded-[14px] px-3 active:opacity-60"
              >
                <item.icon size={20} color={colors.primary} />
                <Text className="flex-1 font-sans-semibold text-[14.5px] text-foreground">
                  {t(item.labelKey)}
                </Text>
                {item.badge ? (
                  <View
                    className={cn(
                      'h-5 min-w-5 items-center justify-center rounded-full px-1.5',
                      item.badge === 'PRO' ? 'bg-secondary' : 'bg-destructive',
                    )}
                  >
                    <Text
                      className={cn(
                        'font-sans-bold text-[11px]',
                        item.badge === 'PRO'
                          ? 'tracking-wider text-primary'
                          : 'text-destructive-foreground',
                      )}
                    >
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>

          <View className="border-border border-t px-3 pt-2">
            {/* Dev-only mode switch (see docs/PRE_RELEASE_CHECKLIST.md) — never
                ships, so a premium flip can't be triggered in production. */}
            {__DEV__ ? (
              <Pressable
                accessibilityRole="button"
                onPress={toggleMode}
                className="h-[46px] flex-row items-center gap-3 rounded-[14px] px-3 active:opacity-60"
              >
                <Crown size={20} color={colors.primary} />
                <Text className="flex-1 font-sans-semibold text-[14.5px] text-foreground">
                  {isPremium ? t('switchToNormal') : t('switchToPremium')}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={logOut}
              className="h-[46px] flex-row items-center gap-3 rounded-[14px] px-3 active:opacity-60"
            >
              <LogOut size={20} color={colors.destructive} />
              <Text className="font-sans-semibold text-[14.5px] text-foreground">
                {t('logOut')}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
