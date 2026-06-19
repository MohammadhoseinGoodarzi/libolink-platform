import { useDictionary } from '@repo/i18n';
import { Heart, Quote } from 'lucide-react-native';
import { View } from 'react-native';
import { Avatar, BookCover, BrandGradient, Card, Stars, Text } from '@/shared/components/ui';
import type { FavoritesSectionProps } from '../types';
import { Chip } from './chip';
import { Section } from './section';

// Favourites (handoff §6.4): favourite book, author, a gradient quote card, and
// genre chips — "the books, voices and lines that made me".
function FavoritesSection({ favorites, genres }: FavoritesSectionProps) {
  const t = useDictionary('Profile');
  const { book, author, quote } = favorites;
  const bookTone = book.tone == null ? {} : { tone: book.tone };

  return (
    <Section title={t('favourites')} sub={t('favouritesSub')} icon={Heart}>
      <View className="gap-3 px-4">
        {/* favourite book */}
        <Card className="p-4">
          <Text className="mb-2.5 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
            {t('favouriteBook')}
          </Text>
          <View className="flex-row gap-3.5">
            <BookCover
              title={book.title}
              author={book.author}
              width={84}
              radius={12}
              {...bookTone}
            />
            <View className="flex-1 justify-center">
              <Text className="font-sans-bold text-[17px] leading-[20px] text-foreground">
                {book.title}
              </Text>
              {book.series ? (
                <Text className="mt-0.5 font-sans text-[13px] text-muted-foreground">
                  {book.series}
                </Text>
              ) : null}
              <Text className="mt-1.5 font-sans text-[13.5px] text-foreground">
                {t('byAuthor')} {book.author}
              </Text>
              <View className="mt-2">
                <Stars count={book.rating} size={15} />
              </View>
            </View>
          </View>
        </Card>

        {/* favourite author */}
        <Card className="p-4">
          <Text className="mb-2.5 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
            {t('favouriteAuthor')}
          </Text>
          <View className="flex-row items-center gap-3">
            <Avatar initials={author.initials} hue={author.hue} name={author.name} size={56} />
            <View className="flex-1">
              <Text className="font-sans-bold text-[16px] leading-[19px] text-foreground">
                {author.name}
              </Text>
              <Text className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
                {author.note}
              </Text>
              <View className="mt-1.5 flex-row gap-3.5">
                <Text className="font-sans text-[12px] text-muted-foreground">
                  <Text className="font-sans-bold text-foreground">{author.books}</Text>{' '}
                  {t('authorBooks')}
                </Text>
                <Text className="font-sans text-[12px] text-muted-foreground">
                  <Text className="font-sans-bold text-foreground">{author.followers}</Text>{' '}
                  {t('authorFollowers')}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* favourite quote — sanctioned brand gradient surface */}
        <BrandGradient className="rounded-lg p-5">
          <View className="absolute right-3.5 top-2">
            <Quote size={64} color="rgba(255,255,255,0.18)" />
          </View>
          <Text
            className="font-sans-bold text-[11px] uppercase tracking-wide"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {t('favouriteQuote')}
          </Text>
          <Text className="mt-2.5 font-sans-semibold text-[18px] leading-[26px] text-white">
            “{quote.text}”
          </Text>
          <Text className="mt-3 font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.78)' }}>
            — {quote.speaker}, <Text className="italic">{quote.source}</Text>
          </Text>
        </BrandGradient>

        {/* favourite genres */}
        <View className="pt-0.5">
          <Text className="mb-2 font-sans-bold text-[11px] uppercase tracking-wide text-muted-foreground">
            {t('favouriteGenres')}
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {genres.map((g) => (
              <Chip key={g} label={g} />
            ))}
          </View>
        </View>
      </View>
    </Section>
  );
}

export { FavoritesSection };
