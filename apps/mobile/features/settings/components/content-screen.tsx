import { useDictionary } from '@repo/i18n';
import type { LanguageCode, SensitiveMode } from '@repo/types';
import { BookOpen, Eye, EyeOff, Flag, Globe, Languages, MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';
import { ActionSheet, useToast } from '@/shared/components/ui';
import { LANGUAGE_LABEL, LANGUAGES } from '../constants';
import { useSelectSheet } from '../hooks/use-select-sheet';
import { useSettings } from '../hooks/use-settings';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Content & Language (handoff): app/translate language selectors, auto-translate
// toggles, and content filtering. Muted Words is a deeper sub-screen (phase-2).
export function ContentScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const { settings, setSettings } = useSettings();
  const { sheet, openSelect, closeSheet } = useSelectSheet();
  const c = settings.content;

  const toggle = (
    key: 'autoTransPosts' | 'autoTransComments' | 'showOriginal' | 'mature' | 'hideRead',
  ) =>
    setSettings((prev) => ({ ...prev, content: { ...prev.content, [key]: !prev.content[key] } }));

  const pickLanguage = (key: 'appLanguage' | 'translateTo', title: string) =>
    openSelect<LanguageCode>(title, LANGUAGES, c[key], (lang) =>
      setSettings((prev) => ({ ...prev, content: { ...prev.content, [key]: lang } })),
    );

  const sensitiveOptions: { key: SensitiveMode; label: string }[] = [
    { key: 'off', label: t('sensitiveOff') },
    { key: 'limit', label: t('sensitiveLimit') },
    { key: 'show', label: t('sensitiveShow') },
  ];
  const sensitiveLabel =
    c.sensitive === 'off'
      ? t('sensitiveOff')
      : c.sensitive === 'show'
        ? t('sensitiveShow')
        : t('sensitiveLimit');

  return (
    <SettingsScreenShell title={t('content')}>
      <SettingsGroupLabel icon={Globe}>{t('langGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Globe}
          title={t('appLanguage')}
          value={LANGUAGE_LABEL[c.appLanguage]}
          onPress={() => pickLanguage('appLanguage', t('appLanguage'))}
        />
        <SettingsRow
          icon={Languages}
          title={t('translateTo')}
          value={LANGUAGE_LABEL[c.translateTo]}
          onPress={() => pickLanguage('translateTo', t('translateTo'))}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={Languages}>{t('translationGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={Languages}
          title={t('autoTransPosts')}
          trailing="switch"
          on={c.autoTransPosts}
          onToggle={() => toggle('autoTransPosts')}
        />
        <SettingsRow
          icon={MessageCircle}
          title={t('autoTransComments')}
          trailing="switch"
          on={c.autoTransComments}
          onToggle={() => toggle('autoTransComments')}
        />
        <SettingsRow
          icon={Eye}
          title={t('showOriginal')}
          subtitle={t('showOriginalSub')}
          trailing="switch"
          on={c.showOriginal}
          onToggle={() => toggle('showOriginal')}
        />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={EyeOff}>{t('filteringGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={EyeOff}
          title={t('sensitiveContent')}
          value={sensitiveLabel}
          onPress={() =>
            openSelect<SensitiveMode>(
              t('sensitiveContent'),
              sensitiveOptions,
              c.sensitive,
              (mode) =>
                setSettings((prev) => ({ ...prev, content: { ...prev.content, sensitive: mode } })),
            )
          }
        />
        <SettingsRow
          icon={Flag}
          title={t('matureContent')}
          subtitle={t('matureContentSub')}
          trailing="switch"
          on={c.mature}
          onToggle={() => toggle('mature')}
        />
        <SettingsRow
          icon={BookOpen}
          title={t('hideRead')}
          subtitle={t('hideReadSub')}
          trailing="switch"
          on={c.hideRead}
          onToggle={() => toggle('hideRead')}
        />
        <SettingsRow
          icon={Flag}
          title={t('mutedWords')}
          onPress={() => toast.show(tCommon('comingSoon'))}
        />
      </GroupCard>
      <SettingsNote>{t('contentNote')}</SettingsNote>

      <ActionSheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.title ?? ''}
        actions={sheet?.actions ?? []}
      />
    </SettingsScreenShell>
  );
}
