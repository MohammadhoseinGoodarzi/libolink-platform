import { useDictionary } from '@repo/i18n';
import { Pressable, View } from 'react-native';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useThemeColors } from '@/shared/theme';
import { ModalShell } from './modal-shell';
import { Text } from './text';
import type { ActionSheetProps } from './types';

// iOS-style contextual menu (handoff §5): grouped action card + separate Cancel,
// slid up over a scrim by ModalShell. Danger actions are crimson; everything else
// is brand green.
function ActionSheet({ open, onClose, title, actions }: ActionSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Common');
  const bottomInset = useBottomInset();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      placement="bottom"
      closeLabel={t('close')}
      panelClassName="px-2"
      panelStyle={{ paddingBottom: bottomInset + 8 }}
    >
      <View className="mb-2 overflow-hidden rounded-lg border border-border bg-card">
        {title ? (
          <View className="border-border border-b px-4 py-3">
            <Text className="text-center text-[12.5px] text-muted-foreground">{title}</Text>
          </View>
        ) : null}
        {actions.map((action, index) => (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              action.onPress?.();
            }}
            className={cnRow(index)}
          >
            {action.icon ? (
              <action.icon size={20} color={action.danger ? colors.destructive : colors.primary} />
            ) : null}
            <Text
              className={
                action.danger
                  ? 'text-[17px] text-destructive font-sans-medium'
                  : 'text-[17px] text-primary font-sans-medium'
              }
              style={action.bold ? boldStyle : undefined}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        className="h-14 items-center justify-center rounded-lg bg-card"
      >
        <Text className="text-[17px] text-primary font-sans-bold">{t('cancel')}</Text>
      </Pressable>
    </ModalShell>
  );
}

const boldStyle = { fontFamily: 'Vazirmatn-Bold' } as const;

function cnRow(index: number): string {
  return index === 0
    ? 'h-14 flex-row items-center justify-center gap-2'
    : 'h-14 flex-row items-center justify-center gap-2 border-border border-t';
}

export { ActionSheet };
