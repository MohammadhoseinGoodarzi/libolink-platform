import { useDictionary } from '@repo/i18n';
import type { ConversationCandidate } from '@repo/types';
import { getInitials } from '@repo/utils';
import { useRouter } from 'expo-router';
import { ChevronRight, User, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Avatar, BookCover, BottomSheet, SearchInput, Text } from '@/shared/components/ui';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useThemeColors } from '@/shared/theme';
import { useConversationCandidates } from '../hooks/use-conversations';
import type { CandidateRowProps, GroupSectionProps, NewMessageSheetProps } from '../types';

// Grabber (~30) + the header row (~44) share BottomSheet's 90% box, so the list
// never overflows behind the Android nav bar (mirror of the share sheet).
const SHEET_CHROME = 74;

function CandidateRow({ candidate: c, onPick }: CandidateRowProps) {
  const colors = useThemeColors();
  const t = useDictionary('Messages');
  const isClub = c.kind === 'club';
  const isCommunity = c.kind === 'club' || c.kind === 'group';
  const TypeIcon = isCommunity ? UsersRound : User;

  const subtitle = isClub
    ? `${t('bookClub')} · ${c.memberCount} ${t('members')}`
    : c.kind === 'group'
      ? `${t('community')} · ${c.memberCount} ${t('members')}`
      : c.handle;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={c.title}
      onPress={() => onPick(c)}
      className="flex-row items-center gap-3 px-4 py-2.5 active:opacity-70"
    >
      {isClub && c.book ? (
        <BookCover title={c.book.title} width={42} radius={11} />
      ) : (
        <Avatar
          initials={getInitials(c.title)}
          name={c.title}
          size={46}
          online={c.online}
          group={c.kind === 'group'}
        />
      )}

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            numberOfLines={1}
            className="shrink font-sans-semibold text-[14.5px] text-foreground"
          >
            {c.title}
          </Text>
          <View className="h-4 w-4 items-center justify-center rounded-full bg-secondary">
            <TypeIcon size={10} color={colors.link} />
          </View>
        </View>
        <Text numberOfLines={1} className="mt-0.5 font-sans text-[12px] text-muted-foreground">
          {subtitle}
        </Text>
      </View>

      <ChevronRight size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function GroupSection({ label, rows, onPick }: GroupSectionProps) {
  if (rows.length === 0) {
    return null;
  }
  return (
    <>
      <Text className="px-4 pt-3 pb-1 font-sans-bold text-[12.5px] text-muted-foreground uppercase tracking-wide">
        {label}
      </Text>
      {rows.map((c) => (
        <CandidateRow key={c.id} candidate={c} onPick={onPick} />
      ))}
    </>
  );
}

// New-message sheet (handoff §6.3): search readers, friends & book clubs, grouped
// into Friends & Readers / Book Clubs / Communities, then open a fresh chat. The
// candidate directory is shared (@repo/api); filtering is trivial UI state.
export function NewMessageSheet({ open, onClose }: NewMessageSheetProps) {
  const t = useDictionary('Messages');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const bottomInset = useBottomInset();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.max(
    340,
    Math.min(height * 0.7, height * 0.9 - SHEET_CHROME - bottomInset),
  );

  const [query, setQuery] = useState('');
  const { data, isLoading } = useConversationCandidates();
  const candidates = data ?? [];

  const q = query.trim().toLowerCase();
  const match = (c: ConversationCandidate) =>
    !q || c.title.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q);
  const visible = candidates.filter(match);
  const people = visible.filter((c) => c.kind === 'dm');
  const clubs = visible.filter((c) => c.kind === 'club');
  const groups = visible.filter((c) => c.kind === 'group');

  // Close first, then navigate after the sheet animates out, so the chat screen
  // mounts over a settled list rather than mid-dismiss. Reset the query too.
  const pick = (c: ConversationCandidate) => {
    onClose();
    setQuery('');
    setTimeout(() => router.push({ pathname: '/chat/[id]', params: { id: c.id } }), 220);
  };

  const dismiss = () => {
    onClose();
    setTimeout(() => setQuery(''), 300);
  };

  const header = (
    <View className="flex-row items-center justify-between border-border border-b px-4 pb-3">
      <Pressable
        accessibilityRole="button"
        onPress={dismiss}
        className="active:opacity-60"
        hitSlop={8}
      >
        <Text className="font-sans-medium text-[14.5px] text-muted-foreground">
          {tCommon('cancel')}
        </Text>
      </Pressable>
      <Text className="font-sans-bold text-[15.5px] text-foreground">{t('newMessageTitle')}</Text>
      <View className="w-12" />
    </View>
  );

  return (
    <BottomSheet open={open} onClose={dismiss} label={t('newMessageTitle')} header={header}>
      <View style={{ height: sheetHeight }}>
        <View className="px-4 pt-3 pb-1">
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('newMessageSearchPlaceholder')}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator className="mt-10" color={colors.primary} />
        ) : visible.length === 0 ? (
          <View className="items-center px-8 pt-12">
            <Text className="text-center font-sans text-[14px] text-muted-foreground">
              {t('newMessageEmpty')}
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <GroupSection label={t('friendsAndReaders')} rows={people} onPick={pick} />
            <GroupSection label={t('filterClubs')} rows={clubs} onPick={pick} />
            <GroupSection label={t('communities')} rows={groups} onPick={pick} />
            <View className="h-4" />
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
}
