import { type MessageKey, useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import {
  BookMarked,
  BookOpen,
  Calendar,
  Flame,
  type LucideIcon,
  Star,
  TrendingUp,
  UsersRound,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { StatsSectionProps } from '../types';
import { Section } from './section';

// The grid excludes followers/following (those live in FollowCounts).
const GRID_KEYS = ['read', 'year', 'streak', 'pages', 'reviews', 'clubs'] as const;
type GridKey = (typeof GRID_KEYS)[number];

const ICONS: Record<GridKey, LucideIcon> = {
  read: BookMarked,
  year: Calendar,
  streak: Flame,
  pages: BookOpen,
  reviews: Star,
  clubs: UsersRound,
};

const LABEL_KEYS: Record<GridKey, MessageKey<'Profile'>> = {
  read: 'statRead',
  year: 'statYear',
  streak: 'statStreak',
  pages: 'statPages',
  reviews: 'statReviews',
  clubs: 'statClubs',
};

// Reading at a glance (handoff §6.4): a 3-column grid of stat tiles.
function StatsSection({ stats }: StatsSectionProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  return (
    <Section title={t('statsTitle')} icon={TrendingUp}>
      <View className="px-4">
        <Card className="overflow-hidden">
          <View className="flex-row flex-wrap">
            {GRID_KEYS.map((key, i) => {
              const Icon = ICONS[key];
              const value = stats.find((s) => s.key === key)?.value ?? '0';
              const col = i % 3;
              const row = Math.floor(i / 3);
              return (
                <View
                  key={key}
                  className={cn(
                    'w-1/3 items-center gap-1.5 px-1.5 py-4',
                    col > 0 && 'border-border border-l',
                    row > 0 && 'border-border border-t',
                  )}
                >
                  <Icon size={16} color={colors.primary} />
                  <Text className="font-sans-bold text-[19px] text-foreground">{value}</Text>
                  <Text className="text-center font-sans text-[10.5px] text-muted-foreground">
                    {t(LABEL_KEYS[key])}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>
    </Section>
  );
}

export { StatsSection };
