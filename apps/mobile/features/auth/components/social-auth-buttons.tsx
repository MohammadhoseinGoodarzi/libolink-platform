import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { Button } from '@/shared/components/ui/button';

// lucide brand icons were removed in v1; social providers render as labelled
// outline buttons mirroring the web app.
export function SocialAuthButtons() {
  const t = useDictionary('Auth');
  return (
    <View className="gap-2">
      <Button variant="outline">{t('continueWithApple')}</Button>
      <Button variant="outline">{t('continueWithGoogle')}</Button>
    </View>
  );
}
