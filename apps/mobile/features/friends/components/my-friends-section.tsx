import { useDictionary } from '@repo/i18n';
import { Pressable, ScrollView } from 'react-native';
import { Avatar, Text, useToast } from '@/shared/components/ui';
import type { MyFriendsSectionProps } from '../types';
import { FriendsSection } from './friends-section';

// My Friends (handoff Friends): a horizontal rail of the reader's connections.
// Tap → the reader preview sheet in friend mode.
function MyFriendsSection({ friends, onOpen }: MyFriendsSectionProps) {
  const t = useDictionary('Friends');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  if (friends.length === 0) {
    return null;
  }
  return (
    <FriendsSection
      title={t('myFriends')}
      sub={`${friends.length} ${t('readingFriends')}`}
      action={t('seeAll')}
      onAction={() => toast.show(tCommon('comingSoon'))}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-5 pb-1"
      >
        {friends.map((reader) => (
          <Pressable
            key={reader.id}
            accessibilityRole="button"
            onPress={() => onOpen(reader)}
            className="w-[76px] items-center gap-2"
          >
            <Avatar initials={reader.initials} hue={reader.hue} size={60} online={reader.online} />
            <Text numberOfLines={1} className="font-sans-semibold text-[12px] text-foreground">
              {reader.name.split(' ')[0]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </FriendsSection>
  );
}

export { MyFriendsSection };
