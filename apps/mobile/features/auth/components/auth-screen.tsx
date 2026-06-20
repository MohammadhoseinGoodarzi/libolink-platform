import { useDictionary } from '@repo/i18n';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useShadow, useThemeColors } from '@/shared/theme';

type AuthScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  center?: boolean;
  padTop?: number;
};

// Auth screen shell (handoff auth kit): scrollable body with a pinned footer and
// an optional floating back button. Keyboard-aware for the form screens.
export function AuthScreen({
  children,
  footer,
  showBack = false,
  center = false,
  padTop = 64,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const shadow = useShadow('card');
  const router = useRouter();
  const t = useDictionary('Common');

  // Reloading/deep-linking onto an auth sub-screen can leave it as the stack
  // root; fall back to welcome so back is never a dead end.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.welcome);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: padTop + insets.top,
            paddingHorizontal: 26,
            paddingBottom: footer ? 16 : 40 + insets.bottom,
            justifyContent: center ? 'center' : 'flex-start',
          }}
        >
          {children}
        </ScrollView>

        {footer ? (
          <View style={{ paddingBottom: insets.bottom + 24 }} className="bg-background px-6 pt-3">
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>

      {showBack ? (
        <View style={{ position: 'absolute', top: insets.top + 12, left: 12 }}>
          <View style={shadow} className="rounded-full bg-card">
            <IconButton accessibilityLabel={t('back')} onPress={goBack}>
              <ChevronLeft size={22} color={colors.primary} />
            </IconButton>
          </View>
        </View>
      ) : null}
    </View>
  );
}
