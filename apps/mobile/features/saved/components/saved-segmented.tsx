import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/components/ui';
import { useShadow } from '@/shared/theme';
import type { SavedSegmentedProps, SavedTabKey } from '../types';

// iOS-style segmented control (handoff Saved): All / Books / Posts. The active
// segment is a raised card on the recessed track.
function SavedSegmented({ value, onChange }: SavedSegmentedProps) {
  const t = useDictionary('Saved');
  const shadow = useShadow('card');
  const tabs: { key: SavedTabKey; label: string }[] = [
    { key: 'all', label: t('tabAll') },
    { key: 'books', label: t('tabBooks') },
    { key: 'posts', label: t('tabPosts') },
  ];

  return (
    <View className="mx-4 mt-3 flex-row rounded-2xl bg-secondary p-1">
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            className={cn('h-8 flex-1 items-center justify-center rounded-xl', active && 'bg-card')}
            style={active ? shadow : undefined}
          >
            <Text
              className={cn(
                'text-[12.5px]',
                active ? 'font-sans-bold text-primary' : 'font-sans-medium text-muted-foreground',
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { SavedSegmented };
