import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import { useAtomValue } from 'jotai';
import { BadgeCheck, ShieldCheck, Star } from 'lucide-react-native';
import { View } from 'react-native';
import { BrandGradient, Button, Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { GroupCard } from './group-card';
import { SettingsGroupLabel } from './settings-group-label';
import { SettingsRow } from './settings-row';
import { SettingsScreenShell } from './settings-screen-shell';

// Account Verification (handoff Account): a status hero + the benefits of being
// verified. Verified readers can view details; unverified readers can request it.
// Verified state is read from the session user (mock).
export function AccVerifyScreen() {
  const t = useDictionary('Settings');
  const toast = useToast();
  const colors = useThemeColors();
  const verified = useAtomValue(userAtom)?.verified ?? false;

  const benefits = [
    { icon: BadgeCheck, title: t('accBenefitBadge'), desc: t('accBenefitBadgeDesc') },
    { icon: ShieldCheck, title: t('accBenefitProtect'), desc: t('accBenefitProtectDesc') },
    { icon: Star, title: t('accBenefitSupport'), desc: t('accBenefitSupportDesc') },
  ];

  return (
    <SettingsScreenShell title={t('accVerifyTitle')}>
      <View className="px-4">
        <Card className="items-center gap-3 p-6">
          {verified ? (
            <BrandGradient className="h-16 w-16 items-center justify-center rounded-full">
              <ShieldCheck size={34} color="#FFFFFF" />
            </BrandGradient>
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShieldCheck size={34} color={colors.mutedForeground} />
            </View>
          )}
          <Text className="text-center font-sans-bold text-[19px] text-foreground">
            {verified ? t('accVerifiedHeading') : t('accUnverifiedHeading')}
          </Text>
          <Text className="text-center font-sans text-[13.5px] text-muted-foreground leading-[20px]">
            {verified ? t('accVerifiedBody') : t('accUnverifiedBody')}
          </Text>
        </Card>
      </View>

      <View className="h-5" />
      <SettingsGroupLabel>{t('accVerifyBenefits')}</SettingsGroupLabel>
      <GroupCard>
        {benefits.map((benefit, index) => (
          <SettingsRow
            key={benefit.title}
            first={index === 0}
            icon={benefit.icon}
            title={benefit.title}
            subtitle={benefit.desc}
            trailing="none"
          />
        ))}
      </GroupCard>

      <View className="px-4 pt-6">
        {verified ? (
          <Button variant="outline" onPress={() => toast.show(t('accVerifyDetailsToast'))}>
            {t('accViewVerifyDetails')}
          </Button>
        ) : (
          <Button onPress={() => toast.show(t('accVerifyRequested'))}>
            {t('accRequestVerification')}
          </Button>
        )}
      </View>
    </SettingsScreenShell>
  );
}
