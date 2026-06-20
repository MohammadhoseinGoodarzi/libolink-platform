import { Stack } from 'expo-router';

// Anchor the stack to welcome so opening/reloading directly onto a sub-screen
// (e.g. verify) still has welcome beneath it — the back button always has a
// target instead of no-opping on a historyless root.
export const unstable_settings = { initialRouteName: 'welcome' };

// Native push stack for the auth flow (welcome → login/signup → success).
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
