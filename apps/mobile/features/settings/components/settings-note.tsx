import { Text } from '@/shared/components/ui';
import type { SettingsNoteProps } from '../types';

// Small explanatory footnote under a group (handoff Settings kit).
function SettingsNote({ children }: SettingsNoteProps) {
  return (
    <Text className="px-5 pt-2.5 font-sans text-[12px] text-muted-foreground leading-[17px]">
      {children}
    </Text>
  );
}

export { SettingsNote };
