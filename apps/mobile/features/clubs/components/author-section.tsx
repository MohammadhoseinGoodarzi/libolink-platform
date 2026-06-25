import { useDictionary } from '@repo/i18n';
import { cn, formatCompactNumber } from '@repo/utils';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { AuthorSectionProps } from '../types';
import { ClubsSection } from './section';

// Author Fan Communities (handoff §6.5): a grouped list of author communities.
function AuthorSection({ authors, onSeeAll, onOpen }: AuthorSectionProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <ClubsSection
      title={t('authors')}
      sub={t('authorsSub')}
      action={t('seeAll')}
      onAction={onSeeAll}
    >
      <View className="px-[18px]">
        <Card className="overflow-hidden">
          {authors.map((c, i) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={c.name}
              onPress={() => onOpen(c.id)}
              className={cn(
                'flex-row items-center gap-3 px-4 py-3.5 active:opacity-70',
                i > 0 && 'border-border border-t',
              )}
            >
              <Avatar initials={c.initials} hue={c.hue} name={c.name} size={46} />
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="font-sans-bold text-[14.5px] text-foreground">
                  {c.name}
                </Text>
                <Text className="mt-0.5 font-sans text-[12px] text-muted-foreground">
                  {formatCompactNumber(c.members)} {t('members')}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Card>
      </View>
    </ClubsSection>
  );
}

export { AuthorSection };
