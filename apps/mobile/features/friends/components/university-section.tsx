import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { GraduationCap } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Avatar, Card, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { UniversitySectionProps } from '../types';
import { AddButton } from './add-button';
import { FriendsSection } from './friends-section';
import { MatchChip } from './match-chip';

// From Your University (handoff Friends): a compact card list of readers at the
// reader's university.
function UniversitySection({ readers, onOpen }: UniversitySectionProps) {
  const t = useDictionary('Friends');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  return (
    <FriendsSection
      title={t('university')}
      sub={t('universitySub')}
      action={t('seeAll')}
      onAction={() => toast.show(tCommon('comingSoon'))}
    >
      <View className="px-5">
        <Card>
          {readers.map((reader, index) => (
            <Pressable
              key={reader.id}
              accessibilityRole="button"
              onPress={() => onOpen(reader)}
              className={cn(
                'flex-row items-center gap-3 px-4 py-3',
                index > 0 && 'border-border border-t',
              )}
            >
              <Avatar
                initials={reader.initials}
                hue={reader.hue}
                size={46}
                online={reader.online}
              />
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="font-sans-bold text-[14.5px] text-foreground">
                  {reader.name}
                </Text>
                <View className="mt-0.5 flex-row items-center gap-1.5">
                  <GraduationCap size={13} color={colors.mutedForeground} />
                  <Text numberOfLines={1} className="font-sans text-[12px] text-muted-foreground">
                    {reader.role}
                  </Text>
                </View>
              </View>
              {reader.score != null && reader.kind ? (
                <MatchChip score={reader.score} kind={reader.kind} />
              ) : null}
              <AddButton name={reader.name} icon={false} />
            </Pressable>
          ))}
        </Card>
      </View>
    </FriendsSection>
  );
}

export { UniversitySection };
