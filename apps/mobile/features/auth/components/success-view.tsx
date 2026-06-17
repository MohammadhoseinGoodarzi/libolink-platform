import { type MessageKey, useDictionary } from '@repo/i18n';
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  type LucideIcon,
  UsersRound,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { AuthBadgeArt } from './auth-badge-art';
import { AuthButton } from './auth-button';
import { AuthScreen } from './auth-screen';

type Perk = { key: string; icon: LucideIcon; title: MessageKey<'Auth'>; desc: MessageKey<'Auth'> };

const PERKS: Perk[] = [
  { key: 'discover', icon: Compass, title: 'perkDiscoverTitle', desc: 'perkDiscoverDesc' },
  { key: 'clubs', icon: UsersRound, title: 'perkClubsTitle', desc: 'perkClubsDesc' },
  { key: 'shelf', icon: BookOpen, title: 'perkShelfTitle', desc: 'perkShelfDesc' },
];

export function SuccessView({ name, onStart }: { name: string; onStart: () => void }) {
  const t = useDictionary('Auth');
  const colors = useThemeColors();

  return (
    <AuthScreen
      center
      footer={
        <AuthButton onPress={onStart}>
          <View className="flex-row items-center gap-2">
            <Text className="font-sans-bold text-[16.5px] text-destructive-foreground">
              {t('startExploring')}
            </Text>
            <ArrowRight size={19} color="#FFFFFF" />
          </View>
        </AuthButton>
      }
    >
      <View className="items-center">
        <AuthBadgeArt icon={Check} />
        <Text
          className="text-center font-sans-bold text-foreground"
          style={{ fontSize: 28, lineHeight: 32, letterSpacing: -0.6 }}
        >
          {t('successTitlePrefix')} {name}!
        </Text>
        <Text className="mt-2.5 max-w-[300px] text-center text-[15px] leading-[23px] text-muted-foreground">
          {t('successSubtitle')}
        </Text>

        <View className="mt-6 w-full gap-2.5">
          {PERKS.map((perk) => (
            <Card key={perk.key} className="flex-row items-center gap-3 border border-border p-3.5">
              <View
                className="h-[42px] w-[42px] items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.secondary }}
              >
                <perk.icon size={21} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-[15.5px] text-card-foreground">
                  {t(perk.title)}
                </Text>
                <Text className="text-[13px] text-muted-foreground">{t(perk.desc)}</Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </AuthScreen>
  );
}
