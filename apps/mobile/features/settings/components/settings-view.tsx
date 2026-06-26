import { useDictionary } from '@repo/i18n';
import { sessionAtom } from '@repo/stores';
import type { Theme } from '@repo/types';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import {
  Bell,
  Database,
  Info,
  Languages,
  LifeBuoy,
  LogOut,
  Palette,
  ShieldCheck,
  UserCog,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Header } from '@/shared/components/shell';
import { ActionSheet, SearchInput, Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAppTheme, useThemeColors } from '@/shared/theme';
import { APP_VERSION, SETTINGS_SEARCH } from '../constants';
import { AccountCard } from './account-card';
import { GroupCard } from './group-card';
import { SettingsRow } from './settings-row';

// Settings index orchestrator (handoff Settings): the account summary + grouped
// category rows. Working controls: the Appearance theme picker and Log Out reuse
// existing infra (useAppTheme, the session). The category detail screens and the
// notifications/privacy/etc. forms are phase-2 (rows acknowledge via toast).
export function SettingsView() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const tShell = useDictionary('Shell');
  const router = useRouter();
  const toast = useToast();
  const setSession = useSetAtom(sessionAtom);
  const colors = useThemeColors();
  const { preference, setTheme } = useAppTheme();

  const [query, setQuery] = useState('');
  const [themeOpen, setThemeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const comingSoon = () => toast.show(tCommon('comingSoon'));
  const themeLabel =
    preference === 'dark'
      ? t('themeDark')
      : preference === 'light'
        ? t('themeLight')
        : t('themeSystem');

  const logOut = () => {
    setLogoutOpen(false);
    setSession(null);
    toast.show(tShell('signedOut'));
    router.replace(ROUTES.welcome);
  };

  const term = query.trim().toLowerCase();
  const results = term
    ? SETTINGS_SEARCH.filter((item) => t(item.label).toLowerCase().includes(term))
    : null;

  const themeOptions: { key: Theme; label: string }[] = [
    { key: 'light', label: t('themeLight') },
    { key: 'dark', label: t('themeDark') },
    { key: 'system', label: t('themeSystem') },
  ];

  return (
    <View className="flex-1 bg-background">
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        <View className="px-5 pt-4">
          <Text
            className="font-sans-bold text-[30px] text-foreground"
            style={{ letterSpacing: -0.6 }}
          >
            {t('title')}
          </Text>
        </View>

        <View className="px-4 pt-3 pb-1">
          <SearchInput value={query} onChangeText={setQuery} placeholder={t('searchPlaceholder')} />
        </View>

        {results ? (
          <View className="pt-2">
            {results.length > 0 ? (
              <GroupCard>
                {results.map((item, index) => (
                  <SettingsRow
                    key={item.key}
                    first={index === 0}
                    icon={item.icon}
                    title={t(item.label)}
                    onPress={comingSoon}
                  />
                ))}
              </GroupCard>
            ) : (
              <Text className="px-8 pt-10 text-center font-sans text-[13.5px] text-muted-foreground">
                {t('noResults')}
              </Text>
            )}
          </View>
        ) : (
          <>
            <AccountCard onEdit={comingSoon} onViewProfile={() => router.push(ROUTES.myProfile)} />

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={UserCog}
                title={t('account')}
                subtitle={t('accountSub')}
                onPress={comingSoon}
              />
              <SettingsRow icon={Bell} title={t('notifications')} onPress={comingSoon} />
              <SettingsRow
                icon={Palette}
                title={t('appearance')}
                value={themeLabel}
                onPress={() => setThemeOpen(true)}
              />
            </GroupCard>

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={ShieldCheck}
                title={t('privacy')}
                subtitle={t('privacySub')}
                onPress={comingSoon}
              />
              <SettingsRow icon={Languages} title={t('content')} onPress={comingSoon} />
              <SettingsRow icon={Database} title={t('storage')} onPress={comingSoon} />
            </GroupCard>

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={LifeBuoy}
                title={t('support')}
                subtitle={t('supportSub')}
                onPress={comingSoon}
              />
              <SettingsRow
                icon={Info}
                title={t('about')}
                value={APP_VERSION}
                onPress={comingSoon}
              />
            </GroupCard>

            <View className="px-4 pt-5">
              <Pressable
                accessibilityRole="button"
                onPress={() => setLogoutOpen(true)}
                className="h-[52px] flex-row items-center justify-center gap-2 rounded-2xl bg-secondary"
              >
                <LogOut size={19} color={colors.destructive} />
                <Text className="font-sans-bold text-[16px] text-destructive">{t('logOut')}</Text>
              </Pressable>
            </View>

            <View className="items-center gap-1.5 px-6 pt-6 pb-2">
              <BrandLogo height={18} />
              <Text className="font-sans text-[11.5px] text-muted-foreground">
                {t('footerTagline')} · {t('version')} {APP_VERSION}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <ActionSheet
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        title={t('themeTitle')}
        actions={themeOptions.map((option) => ({
          label: option.label,
          ...(option.key === preference ? { bold: true } : {}),
          onPress: () => setTheme(option.key),
        }))}
      />

      <ActionSheet
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title={t('logOutConfirm')}
        actions={[{ label: t('logOut'), icon: LogOut, danger: true, bold: true, onPress: logOut }]}
      />
    </View>
  );
}
