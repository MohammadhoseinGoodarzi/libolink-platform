import { useDictionary } from '@repo/i18n';
import { SquarePen } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ConversationList, NewMessageSheet } from '@/features/messages';
import { GlobalSearch } from '@/features/search';
import { Header } from '@/shared/components/shell';
import { IconButton } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

function MessagesHeaderActions({ onCompose }: { onCompose: () => void }) {
  const colors = useThemeColors();
  const t = useDictionary('Messages');
  return (
    <View className="flex-row items-center">
      <GlobalSearch />
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
