import { useDictionary } from '@repo/i18n';
import { Search, SquarePen } from 'lucide-react-native';
import { View } from 'react-native';
import { ConversationList } from '@/features/messages';
import { Header } from '@/shared/components/shell';
import { IconButton, useToast } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

function MessagesHeaderActions() {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  const t = useDictionary('Messages');
  const toast = useToast();
  // Search overlay and the new-message sheet are phase-2 (tracked in the mobile
  // backlog); until then the affordances acknowledge the tap instead of being
  // silently inert.
  const comingSoon = () => toast.show(tCommon('comingSoon'));
  return (
    <View className="flex-row items-center">
      <IconButton accessibilityLabel={tCommon('search')} onPress={comingSoon}>
        <Search size={21} color={colors.primary} />
      </IconButton>
      <IconButton accessibilityLabel={t('newMessage')} onPress={comingSoon}>
        <SquarePen size={20} color={colors.primary} />
      </IconButton>
    </View>
  );
}

export default function MessagesScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header right={<MessagesHeaderActions />} />
      <ConversationList />
    </View>
  );
}
