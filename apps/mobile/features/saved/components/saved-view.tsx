import { useDictionary } from '@repo/i18n';
import type { SavedBook, SavedPost } from '@repo/types';
import { useRouter } from 'expo-router';
import {
  ArrowDownUp,
  Bookmark,
  BookOpen,
  Check,
  Flag,
  Search,
  Trash2,
  UserRound,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Header } from '@/shared/components/shell';
import { ActionSheet, Button, IconButton, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useSaved } from '../hooks/use-saved';
import type { SavedMenuTarget, SavedSortKey, SavedTabKey } from '../types';
import { BookCard } from './book-card';
import { PostCard } from './post-card';
import { SavedSegmented } from './saved-segmented';

const SORT_KEYS: SavedSortKey[] = ['recent', 'oldest', 'visited'];

// Sort over any saved item — recent/oldest by savedAt, most-visited by visits.
function compare(a: SavedBook | SavedPost, b: SavedBook | SavedPost, sort: SavedSortKey): number {
  if (sort === 'visited') {
    return b.visits - a.visits;
  }
  const delta = new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  return sort === 'oldest' ? -delta : delta;
}

// Saved collection orchestrator (handoff Saved): loads the reader's bookmarks via
// the shared @repo/api factory, then renders segmented category tabs, a sort, and
// book/post cards with a per-card ⋯ menu. Swipe-to-remove, multi-select and the
// search overlay are phase-2.
export function SavedView() {
  const t = useDictionary('Saved');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useSaved();

  const [tab, setTab] = useState<SavedTabKey>('all');
  const [sort, setSort] = useState<SavedSortKey>('recent');
  const [sortOpen, setSortOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<SavedMenuTarget | null>(null);
  const [removed, setRemoved] = useState<Record<string, boolean>>({});

  const books = useMemo(
    () => (data?.books ?? []).filter((b) => !removed[b.id]).sort((a, b) => compare(a, b, sort)),
    [data, removed, sort],
  );
  const posts = useMemo(
    () => (data?.posts ?? []).filter((p) => !removed[p.id]).sort((a, b) => compare(a, b, sort)),
    [data, removed, sort],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background">
        <Header title={t('title')} showBack onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {tCommon('genericError')}
          </Text>
          <Button variant="outline" size="sm" onPress={() => void refetch()}>
            {tCommon('retry')}
          </Button>
        </View>
      </View>
    );
  }

  const showBooks = tab !== 'posts';
  const showPosts = tab !== 'books';
  const total = (showBooks ? books.length : 0) + (showPosts ? posts.length : 0);
  const sortLabel = t(
    sort === 'recent' ? 'sortRecent' : sort === 'oldest' ? 'sortOldest' : 'sortVisited',
  );

  const remove = (id: string) => {
    setRemoved((m) => ({ ...m, [id]: true }));
    setMenuFor(null);
    toast.show(t('removed'));
  };

  const menuActions = () => {
    if (!menuFor) {
      return [];
    }
    return [
      {
        label: t('viewProfile'),
        icon: UserRound,
        onPress: () => toast.show(tCommon('comingSoon')),
      },
      { label: t('report'), icon: Flag, onPress: () => toast.show(t('reported')) },
      { label: t('remove'), icon: Trash2, danger: true, onPress: () => remove(menuFor.item.id) },
    ];
  };

  return (
    <View className="flex-1 bg-background">
      <Header
        title={t('title')}
        showBack
        onBack={() => router.back()}
        right={
          <IconButton
            accessibilityLabel={tCommon('search')}
            onPress={() => toast.show(tCommon('comingSoon'))}
          >
            <Search size={21} color={colors.primary} />
          </IconButton>
        }
      />

      <SavedSegmented value={tab} onChange={setTab} />

      <View className="flex-row items-center justify-between px-4 pt-3.5 pb-1">
        <Text className="font-sans text-[12.5px] text-muted-foreground">
          {total} {t('savedCount')}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('sortLabel')}
          onPress={() => setSortOpen(true)}
          className="h-8 flex-row items-center gap-1.5 rounded-full bg-secondary px-3"
        >
          <ArrowDownUp size={15} color={colors.primary} />
          <Text className="font-sans-semibold text-[12.5px] text-primary">{sortLabel}</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pt-1 pb-6"
      >
        {total === 0 ? (
          <View className="items-center px-8 pt-16">
            <View className="h-[76px] w-[76px] items-center justify-center rounded-2xl bg-secondary">
              <Bookmark size={32} color={colors.primary} />
            </View>
            <Text className="mt-4 font-sans-bold text-[17px] text-foreground">
              {t('emptyTitle')}
            </Text>
            <Text className="mt-2 max-w-[240px] text-center font-sans text-[13.5px] text-muted-foreground">
              {t('emptyBody')}
            </Text>
            <Button className="mt-5" onPress={() => router.push('/home')}>
              <View className="flex-row items-center gap-2">
                <BookOpen size={18} color={colors.primaryForeground} />
                <Text className="font-sans-semibold text-[15px] text-primary-foreground">
                  {t('explore')}
                </Text>
              </View>
            </Button>
          </View>
        ) : (
          <>
            {showBooks && books.length > 0 ? (
              <View>
                {tab === 'all' ? (
                  <View className="flex-row items-baseline gap-2 pt-3 pb-3">
                    <Text className="font-sans-bold text-[16px] text-foreground">{t('books')}</Text>
                    <Text className="font-sans text-[12.5px] text-muted-foreground">
                      {books.length}
                    </Text>
                  </View>
                ) : (
                  <View className="h-3" />
                )}
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onOpen={() => toast.show(tCommon('comingSoon'))}
                    onMenu={() => setMenuFor({ kind: 'book', item: book })}
                  />
                ))}
              </View>
            ) : null}

            {showPosts && posts.length > 0 ? (
              <View>
                {tab === 'all' ? (
                  <View className="flex-row items-baseline gap-2 pt-3 pb-3">
                    <Text className="font-sans-bold text-[16px] text-foreground">{t('posts')}</Text>
                    <Text className="font-sans text-[12.5px] text-muted-foreground">
                      {posts.length}
                    </Text>
                  </View>
                ) : (
                  <View className="h-3" />
                )}
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpen={() => toast.show(tCommon('comingSoon'))}
                    onMenu={() => setMenuFor({ kind: 'post', item: post })}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <ActionSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        title={t('sortLabel')}
        actions={SORT_KEYS.map((key) => ({
          label: t(
            key === 'recent' ? 'sortRecent' : key === 'oldest' ? 'sortOldest' : 'sortVisited',
          ),
          ...(key === sort ? { icon: Check } : {}),
          bold: key === sort,
          onPress: () => setSort(key),
        }))}
      />

      <ActionSheet
        open={menuFor !== null}
        onClose={() => setMenuFor(null)}
        title={t('itemMenu')}
        actions={menuActions()}
      />
    </View>
  );
}
