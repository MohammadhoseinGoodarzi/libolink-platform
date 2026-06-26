import { useDictionary } from '@repo/i18n';
import type { ClubKind } from '@repo/types';
import { formatCompactNumber } from '@repo/utils';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, MessagesSquare, Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  BookCover,
  Button,
  Chip,
  IconButton,
  Text,
  useToast,
} from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useClubDetail } from '../hooks/use-club-detail';
import type { ClubDetailViewProps } from '../types';
import { ClubBanner } from './club-banner';
import { ClubLogo } from './club-logo';

const BANNER_H = 132;
const LOGO = 82;

// Publishers and author communities are "followed"; clubs/series/adaptations are
// "joined". Drives the membership button + the count label.
const FOLLOW_KINDS: ReadonlyArray<ClubKind> = ['publisher', 'author'];

const KIND_LABEL: Record<
  ClubKind,
  'kindClub' | 'kindSeries' | 'kindPublisher' | 'kindAdaptation' | 'kindAuthor'
> = {
  club: 'kindClub',
  series: 'kindSeries',
  publisher: 'kindPublisher',
  adaptation: 'kindAdaptation',
  author: 'kindAuthor',
};

// Community detail page (handoff §6.5 phase-2): banner + overlapping logo,
// identity, Join/Follow (optimistic), topic chips, about, currently-reading and
// a members preview. Opened from any directory tile and from a club
// conversation's "View Club". Discussion / see-all members are future slices.
export function ClubDetailView({ id }: ClubDetailViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();
  const t = useDictionary('ClubDetail');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const { data, isLoading, isError, refetch, toggleJoin } = useClubDetail(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {tCommon('genericError')}
        </Text>
        <Button variant="outline" size="sm" onPress={() => void refetch()}>
          {tCommon('retry')}
        </Button>
      </View>
    );
  }

  const club = data;
  const follows = FOLLOW_KINDS.includes(club.kind);
  const countLabel = follows ? t('followers') : t('members');
  const memberPreview = club.memberPreview.slice(0, 5);
  const overflow = club.members - memberPreview.length;

  const onToggleJoin = () => {
    const joined = toggleJoin();
    // null = a request is already in flight; ignore the tap (no toast).
    if (joined === null) {
      return;
    }
    toast.show(
      joined
        ? follows
          ? t('followedToast')
          : t('joinedToast')
        : follows
          ? t('unfollowedToast')
          : t('leftToast'),
    );
  };

  const membershipLabel = club.joined
    ? follows
      ? t('following')
      : t('joined')
    : follows
      ? t('follow')
      : t('join');

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        {/* banner + back button + overlapping logo */}
        <View>
          <ClubBanner tone={club.tone} icon={club.icon} height={BANNER_H + insets.top} />
          <View style={{ top: insets.top }} className="absolute left-1 h-14 flex-row items-center">
            <IconButton accessibilityLabel={tCommon('back')} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </IconButton>
          </View>
          <View className="-mt-9 px-5">
            <View
              className="self-start rounded-[22px] border-4"
              style={{ borderColor: colors.background }}
            >
              <ClubLogo
                label={club.logo}
                icon={club.icon}
                tone={club.tone}
                size={LOGO}
                radius={18}
              />
            </View>
          </View>
        </View>

        {/* identity */}
        <View className="px-5 pt-3">
          <Text className="font-sans-bold text-[22px] leading-[27px] text-foreground">
            {club.name}
          </Text>
          <Text className="mt-1 font-sans-medium text-[12.5px] uppercase tracking-wide text-primary">
            {t(KIND_LABEL[club.kind])}
          </Text>
          <Text className="mt-1 font-sans text-[13px] text-muted-foreground">
            {formatCompactNumber(club.members)} {countLabel}
            {'  ·  '}
            <Text className="font-sans text-[13px] text-primary">
              {formatCompactNumber(club.online)} {t('online')}
            </Text>
          </Text>
        </View>

        {/* topic chips */}
        {club.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 px-5 pt-3">
            {club.tags.map((tag) => (
              <Chip key={tag} label={tag} tone="muted" />
            ))}
          </View>
        ) : null}

        {/* membership + discussion */}
        <View className="flex-row gap-2.5 px-5 pt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={membershipLabel}
            onPress={onToggleJoin}
            className={
              club.joined
                ? 'h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card active:opacity-70'
                : 'h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:opacity-90'
            }
          >
            {club.joined ? (
              <Check size={18} color={colors.primary} />
            ) : (
              <Plus size={18} color={colors.primaryForeground} />
            )}
            <Text
              className="font-sans-bold text-[15px]"
              style={{ color: club.joined ? colors.primary : colors.primaryForeground }}
            >
              {membershipLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('discussion')}
            onPress={() =>
              // Open the club's group chat by the same canonical id; seed the
              // title/kind so it renders even with no inbox conversation yet.
              router.push({
                pathname: '/chat/[id]',
                params: { id, title: club.name, kind: 'club' },
              })
            }
            className="h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card active:opacity-70"
          >
            <MessagesSquare size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* about */}
        <View className="mx-5 mt-5 rounded-2xl border border-border bg-card p-4">
          <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-foreground">
            {t('about')}
          </Text>
          <Text className="mt-1.5 font-sans text-[14.5px] leading-[21px] text-foreground">
            {club.about}
          </Text>
        </View>

        {/* currently reading */}
        {club.currentBook ? (
          <View className="mt-6">
            <Text className="px-5 pb-2 font-sans-bold text-[12.5px] uppercase tracking-wide text-muted-foreground">
              {t('currentlyReading')}
            </Text>
            <View className="mx-5 flex-row items-center gap-3.5 rounded-2xl border border-border bg-card p-4">
              <BookCover
                title={club.currentBook.title}
                author={club.currentBook.author}
                width={56}
                radius={10}
              />
              <View className="min-w-0 flex-1">
                <Text numberOfLines={2} className="font-sans-bold text-[15.5px] text-foreground">
                  {club.currentBook.title}
                </Text>
                <Text className="mt-1 font-sans text-[13px] text-muted-foreground">
                  {club.currentBook.author}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* members preview */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-5 pb-2.5">
            <Text className="font-sans-bold text-[12.5px] uppercase tracking-wide text-muted-foreground">
              {t('membersTitle')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t('membersTitle')}: ${formatCompactNumber(club.members)}`}
              onPress={() => toast.show(tCommon('comingSoon'))}
              className="active:opacity-60"
            >
              <Text className="font-sans-semibold text-[13px] text-primary">
                {formatCompactNumber(club.members)}
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center px-5">
            {memberPreview.map((m, i) => (
              <View
                key={m.id}
                style={{ marginLeft: i === 0 ? 0 : -12, borderColor: colors.background }}
                className="rounded-full border-2"
              >
                <Avatar initials={m.initials} name={m.name} hue={m.hue} size={40} />
              </View>
            ))}
            {overflow > 0 ? (
              <Text className="ml-3 font-sans-medium text-[13px] text-muted-foreground">
                +{formatCompactNumber(overflow)} {t('andMore')}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
