import { useDictionary } from '@repo/i18n';
import type { ActivityVisibility, ListVisibility, ProfileVisibility } from '@repo/types';
import {
  Ban,
  Bell,
  BookOpen,
  Eye,
  History,
  Layers,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  UserCog,
} from 'lucide-react-native';
import { View } from 'react-native';
import { ActionSheet, useToast } from '@/shared/components/ui';
import { useSelectSheet } from '../hooks/use-select-sheet';
import { useSettings } from '../hooks/use-settings';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Privacy & Security (handoff): visibility selectors, discoverability + login
// toggles, and the security entries. Two-factor, login activity, devices and
// blocked users are deeper management sub-screens (phase-2 → acknowledge).
export function PrivacyScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const { settings, setSettings } = useSettings();
  const { sheet, openSelect, closeSheet } = useSelectSheet();
  const p = settings.privacy;
  const soon = () => toast.show(tCommon('comingSoon'));

  const toggle = (key: 'searchable' | 'onlineStatus' | 'readReceipts' | 'loginAlerts') =>
    setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, [key]: !prev.privacy[key] } }));

  const visLabel = (key: ProfileVisibility | ListVisibility) =>
    key === 'public' ? t('visPublic') : key === 'followers' ? t('visFollowers') : t('visPrivate');
  const actLabel = (key: ActivityVisibility) =>
    key === 'everyone'
      ? t('actEveryone')
      : key === 'followers'
        ? t('actFollowersOnly')
        : t('actMe');

  const visOptions: { key: ProfileVisibility; label: string }[] = [
    { key: 'public', label: t('visPublic') },
    { key: 'followers', label: t('visFollowers') },
    { key: 'private', label: t('visPrivate') },
  ];
  const actOptions: { key: ActivityVisibility; label: string }[] = [
    { key: 'everyone', label: t('actEveryone') },
    { key: 'followers', label: t('actFollowersOnly') },
    { key: 'me', label: t('actMe') },
  ];

  return (
    <SettingsScreenShell title={t('privacy')}>
      <SettingsGroupLabel icon={Eye}>{t('visibilityGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={UserCog}
          title={t('profileVisibility')}
          value={visLabel(p.profileVis)}
          onPress={() =>
            openSelect<ProfileVisibility>(t('profileVisibility'), visOptions, p.profileVis, (v) =>
              setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, profileVis: v } })),
            )
          }
        />
        <SettingsRow
          icon={BookOpen}
          title={t('readingActivity')}
          value={actLabel(p.activityVis)}
          onPress={() =>
            openSelect<ActivityVisibility>(t('readingActivity'), actOptions, p.activityVis, (v) =>
              setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, activityVis: v } })),
            )
          }
        />
        <SettingsRow
          icon={Layers}
          title={t('bookListVisibility')}
          value={visLabel(p.listVis)}
          onPress={() =>
            openSelect<ListVisibility>(t('bookListVisibility'), visOptions, p.listVis, (v) =>
              setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, listVis: v } })),
            )
          }
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Search}>{t('discoverabilityGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Search}
          title={t('searchableEmail')}
          subtitle={t('searchableEmailSub')}
          trailing="switch"
          on={p.searchable}
          onToggle={() => toggle('searchable')}
        />
        <SettingsRow
          icon={Eye}
          title={t('showOnlineStatus')}
          trailing="switch"
          on={p.onlineStatus}
          onToggle={() => toggle('onlineStatus')}
        />
        <SettingsRow
          icon={MessageCircle}
          title={t('readReceipts')}
          subtitle={t('readReceiptsSub')}
          trailing="switch"
          on={p.readReceipts}
          onToggle={() => toggle('readReceipts')}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={ShieldCheck}>{t('securityGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={ShieldCheck}
          title={t('twoFactor')}
          value={settings.twofa.enabled ? t('onLabel') : t('offLabel')}
          onPress={soon}
        />
        <SettingsRow
          icon={Bell}
          title={t('loginAlerts')}
          subtitle={t('loginAlertsSub')}
          trailing="switch"
          on={p.loginAlerts}
          onToggle={() => toggle('loginAlerts')}
        />
        <SettingsRow icon={History} title={t('loginActivity')} onPress={soon} />
        <SettingsRow icon={Smartphone} title={t('deviceManagement')} onPress={soon} />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Ban}>{t('safetyGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow first icon={Ban} title={t('blockedUsers')} onPress={soon} />
      </GroupCard>
      <SettingsNote>{t('privacyNote')}</SettingsNote>

      <ActionSheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.title ?? ''}
        actions={sheet?.actions ?? []}
      />
    </SettingsScreenShell>
  );
}
