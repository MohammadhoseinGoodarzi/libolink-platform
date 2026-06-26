import { useDictionary } from '@repo/i18n';
import { Quote, User } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Chip, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { BioSectionProps } from '../types';
import { Section } from './section';

// About (handoff §6.4): bio, a reading-philosophy quote box, and interest chips.
function BioSection({ identity }: BioSectionProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  return (
    <Section title={t('about')} icon={User}>
      <View className="px-4">
        <Card className="p-4">
          <Text className="font-sans text-[14.5px] leading-[23px] text-foreground">
            {identity.bio}
          </Text>

          <View className="mt-3.5 flex-row gap-2.5 rounded-2xl bg-secondary p-3">
            <Quote size={17} color={colors.primary} />
            <View className="flex-1">
              <Text className="font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
                {t('readingPhilosophy')}
              </Text>
              <Text className="mt-1 font-sans text-[14px] italic text-foreground">
                “{identity.philosophy}”
              </Text>
            </View>
          </View>

          <View className="mt-3.5">
            <Text className="mb-2 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
              {t('interests')}
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {identity.interests.map((it) => (
                <Chip key={it} label={it} />
              ))}
            </View>
          </View>
        </Card>
      </View>
    </Section>
  );
}

export { BioSection };
