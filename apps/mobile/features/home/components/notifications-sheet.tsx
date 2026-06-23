import { useDictionary } from '@repo/i18n';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { BottomSheet, Text, useToast } from '@/shared/components/ui';
import { useBottomInset } from '@/shared/hooks/use-bottom-inset';
import { useThemeColors } from '@/shared/theme';
import type { NotificationsSheetProps } from '../types';
import { NotificationRow } from './notification-row';

// Grabber strip + header height, capped against BottomSheet's 90% box so the
// list never overflows behind the Android nav bar (see comments sheet).
const SHEET_CHROME = 72;

// Notifications bottom sheet (handoff §6.2): mark-all-read, real-time list with
// friend-request accept/decline and unread states. List logic + persistence live
// in the shared useNotifications hook; this is the RN UI only.
export function NotificationsSheet({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onRespondToRequest,
}: NotificationsSheetProps) {
  const t = useDictionary('Notifications');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const { height } = useWindowDimensions();
  const bottomInset = useBottomInset();
  const bodyHeight = Math.min(height * 0.8, height * 0.9 - SHEET_CHROME - bottomInset);

  const markAll = () => {
    onMarkAllRead();
    toast.show(t('markedAllRead'));
  };

  const respond = (id: string, accept: boolean) => {
    onRespondToRequest(id, accept);
    toast.show(accept ? t('accepted') : t('declined'));
  };

  // Fixed title bar in BottomSheet's non-scrolling region: Mark-all left, title
  // centre, close right (counted in SHEET_CHROME).
  const header = (
    <View className="flex-row items-center justify-between border-border border-b px-4 pb-3">
      <Pressable accessibilityRole="button" onPress={markAll} className="active:opacity-60">
        <Text className="font-sans-semibold text-[12.5px] text-primary">{t('markAllRead')}</Text>
      </Pressable>
      <Text className="font-sans-bold text-[15px] text-foreground">{t('title')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={tCommon('close')}
        onPress={onClose}
        className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
      >
        <X size={17} color={colors.foreground} />
      </Pressable>
    </View>
  );

  return (
    <BottomSheet open={open} onClose={onClose} label={t('title')} header={header}>
      <View style={{ height: bodyHeight }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <Text className="py-12 text-center font-sans text-[13.5px] text-muted-foreground">
              {t('empty')}
            </Text>
          ) : (
            notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onRespond={respond} />
            ))
          )}
          <View className="h-3" />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
