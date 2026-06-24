import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import type { Story } from '@repo/types';
import { cn, getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Plus } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { AvatarRing, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

const STORY_AVATAR = 54;

function StoryBubble({
  initials,
  name,
  seen,
  active,
  onPress,
  children,
}: {
  initials: string;
  name: string;
  seen: boolean;
  active: boolean;
  onPress?: () => void;
  children?: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      className="w-[70px] items-center gap-1.5 active:opacity-60"
    >
      <AvatarRing
        variant={seen ? 'muted' : 'gradient'}
        size={STORY_AVATAR}
        initials={initials}
        name={name}
      >
        {children}
      </AvatarRing>
      <Text
        numberOfLines={1}
        className={cn(
          'max-w-[70px] text-[11.5px]',
          active ? 'font-sans-bold text-foreground' : 'font-sans-medium text-muted-foreground',
        )}
      >
        {name}
      </Text>
    </Pressable>
  );
}

export function StoriesRow({
  stories,
  onOpen,
}: {
  stories: Story[];
  onOpen?: ((id: string) => void) | undefined;
}) {
  const colors = useThemeColors();
  const user = useAtomValue(userAtom);
  const t = useDictionary('Home');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-3.5 pt-3 pb-2"
      className="border-border border-b"
    >
      {/* Your story — opens the composer/camera (wired with the story viewer later). */}
      <StoryBubble
        initials={getInitials(user?.displayName)}
        name={t('yourStory')}
        seen
        active={false}
      >
        <View
          className="absolute items-center justify-center rounded-full bg-destructive"
          style={{
            right: -1,
            bottom: -1,
            width: 22,
            height: 22,
            borderWidth: 2.5,
            borderColor: colors.card,
          }}
        >
          {/* destructive-foreground is white in both themes (handoff §3.2). */}
          <Plus size={12} color="#FFFFFF" strokeWidth={3} />
        </View>
      </StoryBubble>

      {stories.map((story) => (
        <StoryBubble
          key={story.id}
          initials={getInitials(story.author.displayName)}
          name={story.author.displayName.split(' ')[0] ?? story.author.displayName}
          seen={story.seen}
          active={!story.seen}
          onPress={() => onOpen?.(story.id)}
        />
      ))}
    </ScrollView>
  );
}
