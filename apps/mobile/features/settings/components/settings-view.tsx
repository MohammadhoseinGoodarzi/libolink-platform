import { useDictionary } from '@repo/i18n';
import { sessionAtom } from '@repo/stores';
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
import { Pressable, View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Header } from '@/shared/components/shell';
import { ActionSheet, ScreenScrollView, SearchInput, Text, useToast } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAppTheme, useThemeColors } from '@/shared/theme';
import { APP_VERSION, SETTINGS_SEARCH } from '../constants';
import { AccountCard } from './account-card';
import { GroupCard } from './group-card';
import { SettingsRow } from './settings-row';

// Settings index orchestrator (handoff Settings): the account summary + grouped
// category rows. Each category pushes its /settings/[section] detail screen
// (Appearance is built; the rest render a coming-soon shell for now). Log Out
// reuses the session.
export function SettingsView() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const tShell = useDictionary('Shell');
  const router = useRouter();
  const toast = useToast();
  const setSession = useSetAtom(sessionAtom);
  const colors = useThemeColors();
  const { preference } = useAppTheme();

  const [query, setQuery] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const comingSoon = () => toast.show(tCommon('comingSoon'));
  const openSection = (section: string) =>
    router.push({ pathname: '/settings/[section]', params: { section } });
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

  return (
    <View className="flex-1 bg-background">
      <Header />

      <ScreenScrollView showsVerticalScrollIndicator={false}>
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
            <AccountCard onEdit={comingSoon} onViewProfile={() => router.push('/me')} />

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={UserCog}
                title={t('account')}
                subtitle={t('accountSub')}
                onPress={() => openSection('account')}
              />
              <SettingsRow
                icon={Bell}
                title={t('notifications')}
                onPress={() => openSection('notifications')}
              />
              <SettingsRow
                icon={Palette}
                title={t('appearance')}
                value={themeLabel}
                onPress={() => openSection('appearance')}
              />
            </GroupCard>

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={ShieldCheck}
                title={t('privacy')}
                subtitle={t('privacySub')}
                onPress={() => openSection('privacy')}
              />
              <SettingsRow
                icon={Languages}
                title={t('content')}
                onPress={() => openSection('content')}
              />
              <SettingsRow
                icon={Database}
                title={t('storage')}
                onPress={() => openSection('storage')}
              />
            </GroupCard>

            <View className="h-4" />
            <GroupCard>
              <SettingsRow
                first
                icon={LifeBuoy}
                title={t('support')}
                subtitle={t('supportSub')}
                onPress={() => openSection('support')}
              />
              <SettingsRow
                icon={Info}
                title={t('about')}
                value={APP_VERSION}
                onPress={() => openSection('about')}
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
      </ScreenScrollView>

      <ActionSheet
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title={t('logOutConfirm')}
        actions={[{ label: t('logOut'), icon: LogOut, danger: true, bold: true, onPress: logOut }]}
      />
    </View>
  );
}
