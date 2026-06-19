import { useDictionary } from '@repo/i18n';
import { Layers } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { useToast } from '@/shared/components/ui';
import type { LibrarySectionProps } from '../types';
import { CoverCard } from './cover-card';
import { Section } from './section';

// Personal library (handoff §6.4): the "Read" shelf as a horizontal carousel.
function LibrarySection({ shelves }: LibrarySectionProps) {
  const t = useDictionary('Profile');
  const tCommon = useDictionary('Common');
  const toast = useToast();
  const read = shelves.find((s) => s.key === 'read');
  if (!read) {
    return null;
  }

  return (
    <Section
      title={t('personalLibrary')}
      sub={`${read.count} ${t('booksRead')}`}
      icon={Layers}
      action={t('seeAll')}
      onAction={() => toast.show(tCommon('comingSoon'))}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-1"
      >
        {read.books.map((b, i) => (
          <CoverCard
            key={`${b.title}-${i}`}
            title={b.title}
            author={b.author}
            tone={b.tone}
            width={92}
          />
        ))}
      </ScrollView>
    </Section>
  );
}

export { LibrarySection };
