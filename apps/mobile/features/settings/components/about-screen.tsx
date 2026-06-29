import { useDictionary } from '@repo/i18n';
import { AtSign, BookOpen, ExternalLink, Globe, Scroll, Star } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { APP_VERSION } from '../constants';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// About (handoff): version card, app links, and social channels. Release notes is
// a deeper sub-screen (phase-2); the link rows acknowledge for now.
export function AboutScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const colors = useThemeColors();
  const soon = () => toast.show(tCommon('comingSoon'));

  const socials: { key: string; icon: typeof AtSign; label: string; handle: string }[] = [
    { key: 'x', icon: AtSign, label: t('socialX'), handle: '@libolink' },
    { key: 'ig', icon: AtSign, label: t('socialInstagram'), handle: '@libolink' },
    { key: 'web', icon: Globe, label: t('website'), handle: 'libolink.com' },
    { key: 'gr', icon: BookOpen, label: t('socialGoodreads'), handle: 'Libolink' },
  ];

  return (
    <SettingsScreenShell title={t('about')}>
      <View className="px-4">
        <Card variant="flat" padded className="items-center">
          <View className="h-16 w-16 items-center justify-center rounded-[18px] bg-primary">
            <BookOpen size={32} color={colors.primaryForeground} />
          </View>
          <Text className="mt-3 font-sans-bold text-[20px] text-primary">{t('aboutTagline')}</Text>
          <Text className="mt-0.5 font-sans text-[13px] text-muted-foreground">
            {t('version')} {APP_VERSION}
          </Text>
        </Card>
      </View>

      <View className="h-5" />
      <GroupCard>
        <SettingsRow first icon={Scroll} title={t('releaseNotes')} onPress={soon} />
        <SettingsRow icon={Star} title={t('rateLibolink')} onPress={soon} />
        <SettingsRow icon={Globe} title={t('website')} value="libolink.com" onPress={soon} />
        <SettingsRow icon={ExternalLink} title={t('shareLibolink')} onPress={soon} />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={AtSign}>{t('socialChannels')}</SettingsGroupLabel>
      <GroupCard>
        {socials.map((s, index) => (
          <SettingsRow
            key={s.key}
            first={index === 0}
            icon={s.icon}
            title={s.label}
            value={s.handle}
            onPress={soon}
          />
        ))}
      </GroupCard>
      <SettingsNote>{t('aboutNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
