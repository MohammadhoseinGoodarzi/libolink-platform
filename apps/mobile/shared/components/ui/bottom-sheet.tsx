import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useKeyboardHeight } from '@/shared/hooks/use-keyboard-height';
import { useThemeColors } from '@/shared/theme';
import { ModalShell } from './modal-shell';
import type { BottomSheetProps } from './types';

// Bottom sheet shell (handoff §5): grabber + non-scrolling header region above the
// scroll body, eased slide-up over a scrim. The Modal/scrim/slide/lifecycle all
// live in ModalShell; this owns the grabber, the keyboard-aware bottom padding and
// the 90% box. (Drag-to-dismiss was attempted and removed — ENGINEERING_LOG 2026-06-22.)
function BottomSheet({ open, onClose, children, label, header }: BottomSheetProps) {
  const colors = useThemeColors();
  const t = useDictionary('Common');
  const bottomInset = useBottomInset();
  const keyboardHeight = useKeyboardHeight();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      placement="bottom"
      label={label}
      closeLabel={t('close')}
      panelStyle={{
        maxHeight: '90%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // Closed: clear the Android nav bar. Open: the Modal doesn't resize for
        // the keyboard, so pad by the measured keyboard overlap to sit the
        // composer exactly on top of it (the comments sheet shrinks to match).
        // The overlap already spans any nav bar, so no extra gap.
        paddingBottom: keyboardHeight > 0 ? keyboardHeight : bottomInset,
      }}
    >
      {/* Grabber handle — visual affordance for the sheet. */}
      <View className="items-center pt-3 pb-3">
        <View className="h-1.5 w-12 rounded-full bg-primary" />
      </View>
      {header}
      {children}
    </ModalShell>
  );
}

export { BottomSheet };
