import { useDictionary } from '@repo/i18n';
import { Bell, Search } from 'lucide-react-native';
import { View } from 'react-native';
import { HomeFeed } from '@/features/home';
import { Header } from '@/shared/components/shell';
import { CountBadge, IconButton } from '@/shared/components/ui';
import { useThemeColors } from '@/shared/theme';

function HomeHeaderActions() {
  const colors = useThemeColors();
  const tCommon = useDictionary('Common');
  return (
    <View className="flex-row items-center">
      <IconButton accessibilityLabel={tCommon('search')}>
        <Search size={21} color={colors.primary} />
      </IconButton>
      <View>
        <IconButton accessibilityLabel={tCommon('notifications')}>
          <Bell size={21} color={colors.primary} />
        </IconButton>
        <View className="absolute right-1.5 top-1.5">
          <CountBadge count={9} />
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header showProChip right={<HomeHeaderActions />} />
      <HomeFeed />
    </View>
  );
}
