import { useDictionary } from '@repo/i18n';
import { Search, SquarePen } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ConversationList, NewMessageSheet } from '@/features/messages';
import { Header } from '@/shared/components/shell';
import { IconButton, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

function MessagesHeaderActions({ onCompose }: { onCompose: () => void }) {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const t = useDictionary('Messages');
  const toast = useToast();
  // The header search overlay is phase-2 (tracked in the mobile backlog); until
  // then the icon acknowledges the tap instead of being silently inert. The
  // compose icon opens the new-message sheet.
  const comingSoon = () => toast.show(tCommon('comingSoon'));
  return (
    <View className="flex-row items-center">
      <IconButton accessibilityLabel={tCommon('search')} onPress={comingSoon}>
        <Search size={21} color={colors.primary} />
      </IconButton>
      <IconButton accessibilityLabel={t('newMessage')} onPress={onCompose}>
        <SquarePen size={20} color={colors.primary} />
      </IconButton>
    </View>
  );
}

export default function MessagesScreen() {
  const [compose, setCompose] = useState(false);
  return (
    <View className="flex-1 bg-background">
      <Header right={<MessagesHeaderActions onCompose={() => setCompose(true)} />} />
      <ConversationList />
      <NewMessageSheet open={compose} onClose={() => setCompose(false)} />
    </View>
  );
}
