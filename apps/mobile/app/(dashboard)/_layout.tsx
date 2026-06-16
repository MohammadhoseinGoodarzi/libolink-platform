import { Stack } from 'expo-router';
import { LeftDrawer, LioAssistant } from '@/shared/components/shell';
import { ToastProvider } from '@/shared/components/ui';

// Dashboard shell: a Stack holding the tab group + the drawer-reached screens
// (friends / saved / settings / subscription). The drawer, Lio sheet, and toast
// overlay the whole navigator.
export default function DashboardLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <LeftDrawer />
      <LioAssistant />
    </ToastProvider>
  );
}
