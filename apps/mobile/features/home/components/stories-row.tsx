import { useDictionary } from '@repo/i18n';
import { userAtom } from '@repo/stores';
import type { Story } from '@repo/types';
import { cn, getInitials } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Plus } from 'lucide-react-native';
import { type ReactNode, useId } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Avatar, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

const RING = 64;
const INNER = 54;

// Crimson→navy story ring for unseen stories (handoff §6.2). Seen stories fall
// back to a muted ring. Uses react-native-svg (no expo-linear-gradient).
function GradientRing() {
  const colors = useThemeColors();
  const id = `sr${useId().replace(/:/g, '')}`;
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0" stopColor={colors.destructive} />
          <Stop offset="1" stopColor={colors.link} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" rx={RING / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

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
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      className="w-[70px] items-center gap-1.5 active:opacity-60"
    >
      <View style={{ width: RING, height: RING }}>
        <View
          className="h-full w-full items-center justify-center rounded-full"
          style={{ padding: 2.5, backgroundColor: seen ? colors.border : undefined }}
        >
          {!seen ? <GradientRing /> : null}
          <View
            className="h-full w-full items-center justify-center overflow-hidden rounded-full"
            style={{ borderWidth: 2, borderColor: colors.card }}
          >
            <Avatar initials={initials} name={name} size={INNER} />
          </View>
        </View>
        {children}
      </View>
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
  onOpen?: (id: string) => void;
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
