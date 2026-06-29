import { useDictionary } from '@repo/i18n';
import type { NotificationBooleanKey } from '@repo/types';
import { Bell, Clock, Eye, Filter, Smartphone, Volume2 } from 'lucide-react-native';
import { View } from 'react-native';
import { useToast } from '@/shared/components/ui';
import { NOTIF_CATEGORIES, NOTIF_CHANNELS } from '../constants';
import { useSettings } from '../hooks/use-settings';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Notification settings (handoff): master switch, delivery channels, the granular
// category matrix, alert style, and quiet hours. Everything below the master
// switch is disabled while notifications are off. Editing the quiet-hours times
// needs a native time picker (a new dep), so they acknowledge for now.
export function NotificationsScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const { settings, setSettings } = useSettings();
  const n = settings.notif;
  const off = !n.allow;

  const toggle = (key: NotificationBooleanKey) =>
    setSettings((prev) => ({ ...prev, notif: { ...prev.notif, [key]: !prev.notif[key] } }));

  return (
    <SettingsScreenShell title={t('notifications')}>
      <GroupCard>
        <SettingsRow
          first
          icon={Bell}
          title={t('notifAllow')}
          subtitle={t('notifAllowSub')}
          trailing="switch"
          on={n.allow}
          onToggle={() => toggle('allow')}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Smartphone}>{t('notifDelivery')}</SettingsGroupLabel>
      <GroupCard>
        {NOTIF_CHANNELS.map((c, index) => (
          <SettingsRow
            key={c.key}
            first={index === 0}
            icon={c.icon}
            title={t(c.title)}
            trailing="switch"
            on={!off && Boolean(n[c.key])}
            toggleDisabled={off}
            onToggle={() => toggle(c.key)}
          />
        ))}
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Filter}>{t('notifAbout')}</SettingsGroupLabel>
      <GroupCard>
        {NOTIF_CATEGORIES.map((c, index) => (
          <SettingsRow
            key={c.key}
            first={index === 0}
            icon={c.icon}
            title={t(c.title)}
            trailing="switch"
            on={!off && Boolean(n[c.key])}
            toggleDisabled={off}
            onToggle={() => toggle(c.key)}
          />
        ))}
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Volume2}>{t('notifAlertStyle')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Volume2}
          title={t('notifSounds')}
          trailing="switch"
          on={!off && n.sounds}
          toggleDisabled={off}
          onToggle={() => toggle('sounds')}
        />
        <SettingsRow
          icon={Bell}
          title={t('notifBadges')}
          trailing="switch"
          on={!off && n.badges}
          toggleDisabled={off}
          onToggle={() => toggle('badges')}
        />
        <SettingsRow
          icon={Eye}
          title={t('notifPreview')}
          subtitle={t('notifPreviewSub')}
          trailing="switch"
          on={!off && n.preview}
          toggleDisabled={off}
          onToggle={() => toggle('preview')}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Clock}>{t('notifQuietHours')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Clock}
          title={t('notifQuiet')}
          subtitle={t('notifQuietSub')}
          trailing="switch"
          on={!off && n.quiet}
          toggleDisabled={off}
          onToggle={() => toggle('quiet')}
        />
        {n.quiet && !off ? (
          <>
            <SettingsRow
              title={t('notifQuietFrom')}
              value={n.quietFrom}
              onPress={() => toast.show(tCommon('comingSoon'))}
            />
            <SettingsRow
              title={t('notifQuietTo')}
              value={n.quietTo}
              onPress={() => toast.show(tCommon('comingSoon'))}
            />
          </>
        ) : null}
      </GroupCard>
      <SettingsNote>{t('notifQuietNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
