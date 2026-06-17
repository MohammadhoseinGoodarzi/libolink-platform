import { useDictionary } from '@repo/i18n';
import type { Post } from '@repo/types';
import { ActivityIndicator, FlatList, type ListRenderItem, View } from 'react-native';
import { Button, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { useFeed, useStories } from '../hooks/use-feed';
import { FEED_ADS } from '../services/feed-data';
import type { FeedAd } from '../types';
import { PostCard } from './post-card';
import { PremiumPromoCard } from './premium-promo-card';
import { SponsoredBanner } from './sponsored-banner';
import { StoriesRow } from './stories-row';

// A Sponsored banner follows every 6th post (handoff §6.2).
const ADS_EVERY = 6;

type FeedRow = { kind: 'post'; post: Post } | { kind: 'ad'; key: string; ad: FeedAd };

function buildRows(posts: Post[]): FeedRow[] {
  const rows: FeedRow[] = [];
  posts.forEach((post, index) => {
    rows.push({ kind: 'post', post });
    if ((index + 1) % ADS_EVERY === 0) {
      const adIndex = Math.floor(index / ADS_EVERY);
      const ad = FEED_ADS[adIndex % FEED_ADS.length] as FeedAd;
      rows.push({ kind: 'ad', key: `ad-${adIndex}`, ad });
    }
  });
  return rows;
}

const renderRow: ListRenderItem<FeedRow> = ({ item }) =>
  item.kind === 'post' ? <PostCard post={item.post} /> : <SponsoredBanner ad={item.ad} />;

// Social Home feed (handoff §6.2): stories → Go Premium → posts (+ Sponsored
// every 6). Data flows through the shared @repo/api/@repo/hooks via useFeed.
export function HomeFeed() {
  const t = useDictionary('Home');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const feed = useFeed();
  const stories = useStories();

  if (feed.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
        <Text className="mt-3 font-sans text-[13px] text-muted-foreground">{t('loadingFeed')}</Text>
      </View>
    );
  }

  if (feed.isError || !feed.data) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center font-sans text-[14px] text-muted-foreground">
          {t('feedError')}
        </Text>
        <Button variant="outline" size="sm" onPress={() => void feed.refetch()}>
          {tCommon('retry')}
        </Button>
      </View>
    );
  }

  const rows = buildRows(feed.data.items);

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => (row.kind === 'post' ? row.post.id : row.key)}
      renderItem={renderRow}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-6"
      className="flex-1 bg-background"
      ListHeaderComponent={
        <>
          {stories.data && stories.data.length > 0 ? <StoriesRow stories={stories.data} /> : null}
          <PremiumPromoCard />
        </>
      }
      ListEmptyComponent={
        <View className="items-center px-8 py-16">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {t('emptyFeed')}
          </Text>
        </View>
      }
    />
  );
}
