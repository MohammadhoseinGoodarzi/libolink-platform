import { useDictionary } from '@repo/i18n';
import { formatShortRelativeTime } from '@repo/utils';
import { Clock, MoreHorizontal } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { BookCover, Card, IconButton, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { SavedBookCardProps } from '../types';

// A saved book (handoff Saved): cover, title/author, the saved-at line, and the
// per-card ⋯ menu.
function BookCard({ book, onOpen, onMenu }: SavedBookCardProps) {
  const t = useDictionary('Saved');
  const colors = useThemeColors();
  return (
    // The ⋯ menu is a sibling of the open target, not nested inside it, so a tap
    // on the card never doubles as a tap on the menu button.
    <Card padded className="mb-3 flex-row items-center gap-3.5">
      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        className="min-w-0 flex-1 flex-row items-center gap-3.5"
      >
        <BookCover
          title={book.title}
          author={book.author}
          width={48}
          tone={book.tone}
          radius={12}
        />
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={2}
            className="font-sans-bold text-[14.5px] leading-[18px] text-foreground"
          >
            {book.title}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 font-sans text-[12.5px] text-muted-foreground">
            {book.author}
          </Text>
          <View className="mt-1.5 flex-row items-center gap-1">
            <Clock size={12} color={colors.mutedForeground} />
            <Text className="font-sans text-[11.5px] text-muted-foreground">
              {t('savedPrefix')} {formatShortRelativeTime(book.savedAt)}
            </Text>
          </View>
        </View>
      </Pressable>
      <IconButton accessibilityLabel={t('itemMenu')} onPress={onMenu}>
        <MoreHorizontal size={20} color={colors.mutedForeground} />
      </IconButton>
    </Card>
  );
}

export { BookCard };
