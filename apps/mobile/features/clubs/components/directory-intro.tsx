import { useDictionary } from '@repo/i18n';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { SearchInput, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { DirectoryIntroProps } from '../types';

// Directory title + subtitle, a Create action, and the in-page search field
// (handoff §6.5). Typing filters the directory in place (like the Messages list);
// Create opens a phase-2 flow (acknowledges the tap).
function DirectoryIntro({ query, onQueryChange, onCreate }: DirectoryIntroProps) {
  const t = useDictionary('Clubs');
  const colors = useThemeColors();
  return (
    <View className="px-[18px] pt-4 pb-1">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="font-sans-bold text-[26px] leading-[30px] text-foreground">
            {t('title')}
          </Text>
          <Text className="mt-1 font-sans text-[13.5px] text-muted-foreground">
            {t('subtitle')}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onCreate}
          className="h-[38px] flex-row items-center gap-1 rounded-full border border-border px-3.5 active:opacity-70"
        >
          <Plus size={17} color={colors.primary} />
          <Text className="font-sans-semibold text-[13.5px] text-primary">{t('create')}</Text>
        </Pressable>
      </View>

      <View className="mt-4">
        <SearchInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={t('searchPlaceholder')}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export { DirectoryIntro };
