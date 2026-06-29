import { Check } from 'lucide-react-native';
import { useState } from 'react';
import type { ActionSheetAction } from '@/shared/components/ui';

type SelectState = { title: string; actions: ActionSheetAction[] } | null;

// Single-choice selection via the shared ActionSheet (handoff uses a pushed
// SelectionScreen; an action sheet is the established mobile pattern here). Builds
// the actions up-front so the chosen key stays strongly typed per call.
export function useSelectSheet() {
  const [sheet, setSheet] = useState<SelectState>(null);
  const closeSheet = () => setSheet(null);

  const openSelect = <K extends string>(
    title: string,
    options: { key: K; label: string }[],
    value: K,
    onPick: (key: K) => void,
  ) =>
    setSheet({
      title,
      actions: options.map((option) => ({
        label: option.label,
        ...(option.key === value ? { icon: Check } : {}),
        onPress: () => {
          onPick(option.key);
          setSheet(null);
        },
      })),
    });

  return { sheet, openSelect, closeSheet };
}
