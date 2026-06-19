import { type MessageKey, useDictionary } from '@repo/i18n';
import type { WriterWorkKind } from '@repo/types';
import { cn } from '@repo/utils';
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  Feather,
  FileText,
  Globe,
  type LucideIcon,
  SquarePen,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { WriterSectionProps } from '../types';
import { Section } from './section';

const WORK_ICONS: Record<WriterWorkKind, LucideIcon> = {
  book: BookOpen,
  article: FileText,
  blog: SquarePen,
  publication: Feather,
};

const WORK_LABELS: Record<WriterWorkKind, MessageKey<'Profile'>> = {
  book: 'workBook',
  article: 'workArticle',
  blog: 'workBlog',
  publication: 'workPublication',
};

// Writer & Creator (handoff §6.4): a works list + the personal-website row.
function WriterSection({ writer }: WriterSectionProps) {
  const t = useDictionary('Profile');
  const colors = useThemeColors();
  return (
    <Section title={t('writerCreator')} icon={Feather}>
      <View className="px-4">
        <Card className="overflow-hidden">
          {writer.works.map((w, i) => {
            const Icon = WORK_ICONS[w.kind];
            return (
              <View
                key={`${w.kind}-${i}`}
                className={cn(
                  'flex-row items-center gap-3.5 px-4 py-3.5',
                  i > 0 && 'border-border border-t',
                )}
              >
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                  <Icon size={18} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-bold text-[10px] uppercase tracking-wide text-link">
                    {t(WORK_LABELS[w.kind])}
                  </Text>
                  <Text className="mt-0.5 font-sans-bold text-[14px] leading-[17px] text-foreground">
                    {w.title}
                  </Text>
                  <Text className="mt-0.5 font-sans text-[11.5px] text-muted-foreground">
                    {w.meta}
                  </Text>
                </View>
                <ChevronRight size={17} color={colors.mutedForeground} />
              </View>
            );
          })}

          <View className="flex-row items-center gap-3.5 border-border border-t bg-secondary px-4 py-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Globe size={18} color={colors.primaryForeground} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-[10px] uppercase tracking-wide text-link">
                {t('personalWebsite')}
              </Text>
              <Text className="font-sans-bold text-[14px] text-link">{writer.website}</Text>
            </View>
            <ExternalLink size={17} color={colors.link} />
          </View>
        </Card>
      </View>
    </Section>
  );
}

export { WriterSection };
