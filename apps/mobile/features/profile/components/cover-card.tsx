import { View } from 'react-native';
import { BookCover, Text } from '@/shared/components/ui';
import type { CoverCardProps } from '../types';

// Generated cover + title/author, the carousel atom (handoff §6.4). Reuses the
// shared BookCover; `children` lets callers append a rating row beneath.
// Display-only for now — per-cover navigation lands in profile phase-2.
function CoverCard({ title, author, tone, width = 96, children }: CoverCardProps) {
  // Conditional spread avoids passing `undefined` to BookCover's optional `tone`
  // under exactOptionalPropertyTypes; BookCover derives a tone from the title.
  const toneProp = tone == null ? {} : { tone };
  return (
    <View style={{ width }} className="shrink-0">
      <BookCover title={title} author={author} width={width} radius={12} {...toneProp} />
      <Text
        numberOfLines={2}
        style={{ width }}
        className="mt-2 font-sans-semibold text-[12px] leading-[15px] text-foreground"
      >
        {title}
      </Text>
      <Text numberOfLines={1} className="font-sans text-[11px] text-muted-foreground">
        {author}
      </Text>
      {children}
    </View>
  );
}

export { CoverCard };
