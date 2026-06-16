import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/shared/components/shell';

// Home · Messages · Clubs · Profile. The raised AI-assistant centre button lives
// in BottomTabBar and opens Lio rather than navigating, so it isn't a screen.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => <BottomTabBar />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="clubs" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
