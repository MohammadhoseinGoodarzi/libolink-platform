import { useDictionary } from '@repo/i18n';
import {
  CircleHelp,
  FileText,
  Flag,
  MessageCircle,
  ShieldCheck,
  UserPlus,
} from 'lucide-react-native';
import { View } from 'react-native';
import { useToast } from '@/shared/components/ui';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsNote } from './settings-note';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Support (handoff): the help + policies entry points. Help center, contact and
// report forms and the document viewers are deeper sub-screens (phase-2).
export function SupportScreen() {
  const t = useDictionary('Settings');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const soon = () => toast.show(tCommon('comingSoon'));

  return (
    <SettingsScreenShell title={t('support')}>
      <SettingsGroupLabel icon={CircleHelp}>{t('getHelpGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow
          first
          icon={CircleHelp}
          title={t('helpCenter')}
          subtitle={t('helpCenterSub')}
          onPress={soon}
        />
        <SettingsRow icon={MessageCircle} title={t('contactSupport')} onPress={soon} />
        <SettingsRow icon={Flag} title={t('reportProblem')} danger onPress={soon} />
      </GroupCard>

      <View className="h-5" />
      <SettingsGroupLabel icon={FileText}>{t('policiesGroup')}</SettingsGroupLabel>
      <GroupCard>
        <SettingsRow first icon={UserPlus} title={t('communityGuidelines')} onPress={soon} />
        <SettingsRow icon={FileText} title={t('termsOfService')} onPress={soon} />
        <SettingsRow icon={ShieldCheck} title={t('privacyPolicy')} onPress={soon} />
      </GroupCard>
      <SettingsNote>{t('supportNote')}</SettingsNote>
    </SettingsScreenShell>
  );
}
