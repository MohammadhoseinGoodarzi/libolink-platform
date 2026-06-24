import { useState } from 'react';
import { View } from 'react-native';
import { ComposeDock, HomeFeed, NotificationsBell, StoryViewer } from '@/features/home';
import { GlobalSearch } from '@/features/search';
import { Header } from '@/shared/components/shell';

function HomeHeaderActions() {
  return (
    <View className="flex-row items-center">
      <GlobalSearch />
      <NotificationsBell />
    </View>
  );
}

export default function HomeScreen() {
  const [storyId, setStoryId] = useState<string | null>(null);
  return (
    <View className="flex-1 bg-background">
      <Header showProChip right={<HomeHeaderActions />} />
      <HomeFeed onOpenStory={setStoryId} />
      <ComposeDock />
      {storyId ? (
        <StoryViewer key={storyId} startId={storyId} onClose={() => setStoryId(null)} />
      ) : null}
    </View>
  );
}
