import { useDictionary } from '@repo/i18n';
import { View } from 'react-native';
import { BrandLogo } from '@/shared/components/brand-logo';
import { Text } from '@/shared/components/ui';
import { AuthButton } from './auth-button';
import { AuthScreen } from './auth-screen';
import { GoogleButton } from './google-button';
import { WelcomeHero } from './welcome-hero';

type WelcomeViewProps = {
  onCreateAccount: () => void;
  onSignIn: () => void;
  onGoogle: () => void;
};

export function WelcomeView({ onCreateAccount, onSignIn, onGoogle }: WelcomeViewProps) {
  const t = useDictionary('Auth');
  return (
    <AuthScreen
      padTop={58}
      footer={
        <View className="gap-3">
          <AuthButton onPress={onCreateAccount}>{t('createAccount')}</AuthButton>
          <AuthButton variant="outline" onPress={onSignIn}>
            {t('signIn')}
          </AuthButton>
          <View className="h-0.5" />
          <GoogleButton onPress={onGoogle} />
        </View>
      }
    >
      <View className="mb-2 items-center">
        <BrandLogo height={33} />
      </View>
      <WelcomeHero />
      <View className="mt-1 items-center">
        <Text
          className="text-center font-sans-bold text-foreground"
          style={{ fontSize: 30, lineHeight: 34, letterSpacing: -0.7 }}
        >
          {t('welcomeTitle')}
        </Text>
        <Text className="mt-3 max-w-[320px] text-center text-[15.5px] leading-[24px] text-muted-foreground">
          {t('welcomeSubtitle')}
        </Text>
      </View>
    </AuthScreen>
  );
}
