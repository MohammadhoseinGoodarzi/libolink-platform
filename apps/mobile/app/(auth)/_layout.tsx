import { Stack } from 'expo-router';

// Native push stack for the auth flow (welcome → login/signup → success).
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
