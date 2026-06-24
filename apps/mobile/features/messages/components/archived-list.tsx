import { useConversationList } from '@repo/hooks';
import { useDictionary } from '@repo/i18n';
import type { Conversation } from '@repo/types';
import { useRouter } from 'expo-router';
import { Archive, ArrowLeft, Trash2 } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Text, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';
import { messagesClient } from '../services/messages-service';
import type { SwipeAction } from '../types';
import { ConversationRow } from './conversation-row';
import { SwipeableRow } from './swipeable-row';

// Archived folder (Telegram-style): the conversations swiped to Archive. Swipe a
// row to Unarchive (leading) or Delete (trailing); tap opens the chat. Shares the
// same useConversationList controller (React Query cache) as the main list, so
// (un)archiving here reflects there instantly.
export function ArchivedList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const t = useDictionary('Messages');
  const tCommon = useDictionary('Common');
  const colors = useThemeColors();
  const toast = useToast();
  const { archived, unarchive, remove } = useConversationList(messagesClient);

  const open = (id: string) => router.push({ pathname: '/chat/[id]', params: { id } });

  const renderRow = (c: Conversation) => {
    const leading: SwipeAction[] = [
      {
        key: 'unarchive',
        label: t('unarchive'),
        icon: Archive,
        background: colors.primary,
        onPress: () => {
          unarchive(c.id);
          toast.show(t('unarchived'));
        },
      },
    ];
    const trailing: SwipeAction[] = [
      {
        key: 'delete',
        label: tCommon('delete'),
        icon: Trash2,
        background: colors.destructive,
        onPress: () => {
          remove(c.id);
          toast.show(t('deleted'));
        },
      },
    ];
    return (
      <SwipeableRow
        key={c.id}
        onPress={() => open(c.id)}
        leadingActions={leading}
        trailingActions={trailing}
      >
        <ConversationRow conversation={c} />
      </SwipeableRow>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top }} className="border-border border-b bg-background">
        <View className="h-14 flex-row items-center gap-1 px-1">
          <IconButton accessibilityLabel={tCommon('back')} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.primary} />
          </IconButton>
          <Text className="ml-1 font-sans-bold text-[18px] text-foreground">
            {t('archivedFolder')}
          </Text>
        </View>
      </View>

      {archived.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center font-sans text-[14px] text-muted-foreground">
            {t('archivedEmpty')}
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
          {archived.map((c) => renderRow(c))}
        </ScrollView>
      )}
    </View>
  );
}
