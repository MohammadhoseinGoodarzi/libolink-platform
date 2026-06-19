import { type MessageKey, useDictionary } from '@repo/i18n';
import type { ReadingFormatKey } from '@repo/types';
import { cn } from '@repo/utils';
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Headphones,
  type LucideIcon,
  Tablet,
  Target,
} from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { ProgressRingProps, ReadingLifeSectionProps } from '../types';
import { Chip } from './chip';
import { Section } from './section';

const FORMAT_ICONS: Record<ReadingFormatKey, LucideIcon> = {
  physical: BookOpen,
  ebook: Tablet,
  audiobook: Headphones,
};

const FORMAT_LABELS: Record<ReadingFormatKey, MessageKey<'Profile'>> = {
  physical: 'formatPhysical',
  ebook: 'formatEbook',
  audiobook: 'formatAudiobook',
};

// Circular goal progress (handoff §6.4) — track + brand-green arc, value centred.
function ProgressRing({ done, target, caption, size = 68 }: ProgressRingProps) {
  const colors = useThemeColors();
  const stroke = 6;
  const radius = (size - stroke) / 2 - 1;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, target > 0 ? done / target : 0);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.muted}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-sans-bold text-[15px] text-foreground" style={{ lineHeight: 16 }}>
          {done}
        </Text>
        <Text className="font-sans text-[9.5px] text-muted-foreground">{caption}</Text>
      </View>
    </View>
  );
}

// Reading Life (handoff §6.4): annual goal ring, month + favourite-time tiles,
// preferred formats, and languages read.
function ReadingLifeSection({ readingLife }: ReadingLifeSectionProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  const rl = readingLife;
  const remaining = Math.max(0, rl.goal.target - rl.goal.done);

  return (
    <Section title={t('readingLife')} icon={Target}>
      <View className="gap-3 px-4">
        {/* annual goal */}
        <Card className="flex-row items-center gap-4 p-4">
          <ProgressRing
            done={rl.goal.done}
            target={rl.goal.target}
            caption={`${t('ofLabel')} ${rl.goal.target}`}
            size={68}
          />
          <View className="flex-1">
            <Text className="font-sans-bold text-[14.5px] text-foreground">
              {t('readingGoalTitle')}
            </Text>
            <Text className="mt-0.5 font-sans text-[12.5px] leading-[18px] text-muted-foreground">
              {remaining} {t('goalToGo')}
            </Text>
          </View>
        </Card>

        {/* month + favourite time */}
        <View className="flex-row gap-3">
          <Card className="flex-1 p-3.5">
            <Calendar size={17} color={colors.primary} />
            <Text className="mt-2 font-sans-bold text-[19px] text-foreground">
              {rl.month.done}
              <Text className="font-sans-semibold text-[13px] text-muted-foreground">
                /{rl.month.target}
              </Text>
            </Text>
            <Text className="font-sans text-[12px] text-muted-foreground">
              {rl.month.label} {t('progressSuffix')}
            </Text>
          </Card>
          <Card className="flex-1 p-3.5">
            <Clock size={17} color={colors.primary} />
            <Text className="mt-2 font-sans-bold text-[16px] text-foreground">
              {rl.favoriteTime}
            </Text>
            <Text className="font-sans text-[12px] text-muted-foreground">
              {t('favouriteReadingTime')}
            </Text>
          </Card>
        </View>

        {/* preferred formats */}
        <Card className="p-4">
          <Text className="mb-2.5 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
            {t('preferredFormats')}
          </Text>
          <View className="flex-row gap-2.5">
            {rl.formats.map((f) => {
              const Icon = FORMAT_ICONS[f.key];
              return (
                <View
                  key={f.key}
                  className={cn(
                    'flex-1 items-center gap-1.5 rounded-2xl py-3.5',
                    f.active ? 'bg-primary' : 'bg-secondary',
                  )}
                >
                  <Icon
                    size={20}
                    color={f.active ? colors.primaryForeground : colors.mutedForeground}
                  />
                  <Text
                    className={cn(
                      'font-sans-semibold text-[12px]',
                      f.active ? 'text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {t(FORMAT_LABELS[f.key])}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* languages */}
        <Card className="p-4">
          <Text className="mb-2.5 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
            {t('languagesRead')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {rl.languages.map((l) => (
              <Chip key={l} label={l} icon={Globe} />
            ))}
          </View>
        </Card>
      </View>
    </Section>
  );
}

export { ReadingLifeSection };
