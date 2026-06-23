import { useNotifications } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { CountBadge, IconButton } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { notificationsClient } from '../services/notifications-service';
import { NotificationsSheet } from './notifications-sheet';

// Header bell (handoff §6.2): unread count badge + opens the notifications sheet.
// Owns the single useNotifications instance so the badge and sheet stay in sync.
export function NotificationsBell() {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const t = useDictionary('Notifications');
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, respondToRequest } =
    useNotifications(notificationsClient);

  return (
    <View>
      <IconButton accessibilityLabel={tCommon('notifications')} onPress={() => setOpen(true)}>
        <Bell size={21} color={colors.primary} />
      </IconButton>
      {unreadCount > 0 ? (
        <View className="absolute right-1.5 top-1.5" pointerEvents="none">
          <CountBadge count={unreadCount} />
        </View>
      ) : null}
      <NotificationsSheet
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllRead}
        onRespondToRequest={(id, accept) =>
          respondToRequest(id, accept, accept ? t('nowFriendsText') : t('declinedText'))
        }
      />
    </View>
  );
}
