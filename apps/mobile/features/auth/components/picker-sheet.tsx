import { useDictionary } from '@repo/i18n';
import { cn } from '@repo/utils';
import { Check, X as Close, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { BottomSheet, IconButton, InputBase, Text } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import type { PickerSheetProps } from '../types';

// Single-choice bottom-sheet picker with optional live search (handoff auth kit).
export function PickerSheet({
  open,
  onClose,
  title,
  options,
  value,
  onPick,
  search = false,
}: PickerSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Auth');
  const { height } = useWindowDimensions();
  const [query, setQuery] = useState('');

  const list =
    search && query
      ? options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))
      : options;

  return (
    <BottomSheet open={open} onClose={onClose} label={title}>
      <View style={{ height: height * 0.7 }}>
        <View className="flex-row items-center justify-between px-4 pb-2">
          <Text className="font-sans-bold text-[17px] text-foreground">{title}</Text>
          <IconButton
            accessibilityLabel={t('select')}
            onPress={onClose}
            size={32}
            className="bg-secondary"
          >
            <Close size={17} color={colors.mutedForeground} />
          </IconButton>
        </View>

        {search ? (
          <View className="px-4 pb-2">
            <InputBase
              left={<Search size={17} color={colors.mutedForeground} />}
              containerClassName="h-11 gap-2.5 rounded-2xl border border-border bg-secondary px-3.5"
              value={query}
              onChangeText={setQuery}
              placeholder={`${t('searchPrefix')} ${title.toLowerCase()}`}
              className="h-full font-sans"
            />
          </View>
        ) : null}

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3.5 pb-6"
          keyboardShouldPersistTaps="handled"
        >
          {list.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => {
                  onPick(option);
                  onClose();
                }}
                className={cn(
                  'mb-0.5 flex-row items-center justify-between rounded-2xl px-3.5 py-3.5 active:opacity-60',
                  selected && 'bg-secondary',
                )}
              >
                <Text
                  className={cn(
                    'text-[15.5px]',
                    selected
                      ? 'font-sans-bold text-foreground'
                      : 'font-sans-medium text-foreground',
                  )}
                >
                  {option}
                </Text>
                {selected ? <Check size={19} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
          {list.length === 0 ? (
            <Text className="py-6 text-center text-[13.5px] text-muted-foreground">
              {t('noMatches')}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
