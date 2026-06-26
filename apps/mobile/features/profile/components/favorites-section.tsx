import { useDictionary } from '@repo/i18n';
import { Heart } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Avatar, BookCover, BrandGradient, Card, Chip, Stars, Text } from '@/shared/components/ui';
import { useShadow } from '@/shared/theme';
import type { FavoritesSectionProps } from '../types';
import { Section } from './section';

// Favourites (handoff §6.4): favourite book, author, a gradient quote card, and
// genre chips — "the books, voices and lines that made me".
function FavoritesSection({ favorites, genres }: FavoritesSectionProps) {
  const t = useDictionary('Profile');
  const quoteShadow = useShadow('card');
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

        {/* favourite quote — sanctioned brand gradient surface. Shadow sits on an
            outer view because BrandGradient is overflow-hidden (to clip its SVG to
            the rounded corners), which would otherwise clip the shadow on iOS. */}
        <View className="rounded-lg" style={quoteShadow}>
          <BrandGradient className="rounded-lg p-5">
            {/* Soft filled quote watermark — the prototype uses a solid glyph (a
                stroked lucide icon reads as thin scratchy lines at 18% opacity). */}
            <View className="absolute right-3.5 top-2">
              <Svg width={64} height={64} viewBox="0 0 24 24" fill="rgba(255,255,255,0.18)">
                <Path d="M10 7H5.5A2.5 2.5 0 0 0 3 9.5V13a3 3 0 0 0 3 3h1v-2.5H6A.5.5 0 0 1 5.5 13v-1H8a2 2 0 0 0 2-2V7Zm11 0h-4.5A2.5 2.5 0 0 0 14 9.5V13a3 3 0 0 0 3 3h1v-2.5h-1a.5.5 0 0 1-.5-.5v-1H19a2 2 0 0 0 2-2V7Z" />
              </Svg>
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
            <Text
              className="mt-3 font-sans text-[13px]"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              — {quote.speaker}, <Text className="italic">{quote.source}</Text>
            </Text>
          </BrandGradient>
        </View>

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
