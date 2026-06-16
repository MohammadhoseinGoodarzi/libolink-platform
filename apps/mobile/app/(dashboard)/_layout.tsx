import { Stack } from 'expo-router';
import { LeftDrawer, LioAssistant } from '@/shared/components/shell';

// Dashboard shell: a Stack holding the tab group + the drawer-reached screens
// (friends / saved / settings / subscription). The drawer + Lio sheet overlay
// the navigator; the toast lives at the app root.
export default function DashboardLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <LeftDrawer />
      <LioAssistant />
    </>
  );
}
