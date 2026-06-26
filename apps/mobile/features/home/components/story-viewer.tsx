import { useDictionary } from '@repo/i18n';
import { getInitials } from '@repo/utils';
import { Heart, Send, X } from 'lucide-react-native';
import { useEffect, useId, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Avatar, ModalShell, Text, useToast } from '@/shared/components/ui';
import { hueFromString, oklchToHex, useThemeColors } from '@/shared/theme';
import { useStories } from '../hooks/use-feed';
import type { StoryViewerProps } from '../types';

const SEGMENT_MS = 5000;

// Full-screen story viewer (handoff §6.2): segmented progress that auto-advances,
// tap zones for prev/next, an author-hued backdrop, and a reply bar with like +
// share. Reply typing and real sharing land in a later pass.
export function StoryViewer({ startId, onClose }: StoryViewerProps) {
  const t = useDictionary('Home');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const stories = useStories();
  const items = stories.data ?? [];

  const startIndex = Math.max(
    0,
    items.findIndex((s) => s.id === startId),
  );
  const [si, setSi] = useState(startIndex);
  const [seg, setSeg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [pct, setPct] = useState(0);
  const gradientId = `sv${useId().replace(/:/g, '')}`;

  const story = items[si];

  // Tick the active segment's fill from 0→100% over SEGMENT_MS, then page to the
  // next story (or close). Interval-driven state (not Animated) so the bar grows
  // smoothly over time on both native and web.
  useEffect(() => {
    if (!story) {
      return undefined;
    }
    setPct(0);
    const STEP_MS = 30;
    const steps = SEGMENT_MS / STEP_MS;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setPct(Math.min(100, (step / steps) * 100));
      if (step < steps) {
        return;
      }
      clearInterval(id);
      if (seg < story.segments.length - 1) {
        setSeg(seg + 1);
      } else if (si < items.length - 1) {
        setSi(si + 1);
        setSeg(0);
      } else {
        onClose();
      }
    }, STEP_MS);
    return () => clearInterval(id);
  }, [si, seg, story, items.length, onClose]);

  // Reset the like state when paging to a different story.
  useEffect(() => {
    setLiked(false);
  }, [si]);

  // A story with no segments can't render — close instead of dead-ending.
  useEffect(() => {
    if (story && story.segments.length === 0) {
      onClose();
    }
  }, [story, onClose]);

  if (!story) {
    return null;
  }
  const segment = story.segments[seg];
  if (!segment) {
    return null;
  }

  const hue = hueFromString(story.author.username || story.author.displayName);
  const from = oklchToHex(0.45, 0.13, hue);
  const to = oklchToHex(0.2, 0.08, hue);

  const goPrev = () => {
    if (seg > 0) {
      setSeg(seg - 1);
      return;
    }
    if (si > 0) {
      const prev = items[si - 1];
      setSi(si - 1);
      setSeg(Math.max(0, (prev?.segments.length ?? 1) - 1));
    }
  };
  const goNext = () => {
    if (seg < story.segments.length - 1) {
      setSeg(seg + 1);
      return;
    }
    if (si < items.length - 1) {
      setSi(si + 1);
      setSeg(0);
      return;
    }
    onClose();
  };

  return (
    <ModalShell open onClose={onClose} placement="full" enterDuration={220} exitDuration={180}>
      <View className="flex-1">
        {/* author-hued backdrop */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0" stopColor={from} />
                <Stop offset="1" stopColor={to} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
        </View>

        {/* tap zones (under the chrome) — spatial prev/next, like Instagram */}
        <Pressable
          onPress={goPrev}
          style={{ position: 'absolute', left: 0, top: 80, bottom: 96, width: '33%' }}
        />
        <Pressable
          onPress={goNext}
          style={{ position: 'absolute', right: 0, top: 80, bottom: 96, width: '67%' }}
        />

        {/* segmented progress */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: insets.top + 8, left: 12, right: 12 }}
          className="flex-row gap-1.5"
        >
          {story.segments.map((s, i) => (
            <View
              key={s.id}
              className="h-[3px] flex-1 overflow-hidden rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
            >
              {i < seg ? (
                <View
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: '#FFFFFF' }}
                />
              ) : i === seg ? (
                <View
                  className="h-full w-full rounded-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    transformOrigin: 'left',
                    transform: [{ scaleX: pct / 100 }],
                  }}
                />
              ) : null}
            </View>
          ))}
        </View>

        {/* header */}
        <View
          style={{ position: 'absolute', top: insets.top + 22, left: 12, right: 12 }}
          className="flex-row items-center gap-2.5"
        >
          <Avatar
            initials={getInitials(story.author.displayName)}
            name={story.author.displayName}
            size={34}
          />
          <Text className="font-sans-bold text-[14px] text-white">{story.author.displayName}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tCommon('close')}
            onPress={onClose}
            className="ml-auto h-10 w-10 items-center justify-center active:opacity-60"
          >
            <X size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* segment content */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 18, right: 18, bottom: insets.bottom + 96 }}
        >
          <Text className="font-sans-bold text-[25px] leading-[30px] text-white">
            {segment.title}
          </Text>
          <Text className="mt-2 font-sans text-[14px] text-white/90">{segment.caption}</Text>
        </View>

        {/* reply bar */}
        <View
          style={{ position: 'absolute', left: 14, right: 14, bottom: insets.bottom + 16 }}
          className="flex-row items-center gap-2.5"
        >
          <View
            className="h-[46px] flex-1 flex-row items-center rounded-full px-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.32)',
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('replyPlaceholder')}
              onPress={() => toast.show(tCommon('comingSoon'))}
              className="h-full flex-1 justify-center active:opacity-70"
            >
              <Text className="font-sans text-[13.5px] text-white/85">{t('replyPlaceholder')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('like')}
              onPress={() => setLiked((v) => !v)}
              className="h-9 w-9 items-center justify-center active:opacity-70"
            >
              <Heart
                size={22}
                color={liked ? colors.destructive : '#FFFFFF'}
                fill={liked ? colors.destructive : 'transparent'}
              />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('share')}
            onPress={() => toast.show(tCommon('comingSoon'))}
            className="h-[46px] w-[46px] items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.32)',
            }}
          >
            <Send size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </ModalShell>
  );
}
