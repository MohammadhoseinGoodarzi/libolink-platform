import { useDictionary } from '@repo/i18n';
import { Button, Text } from '@/shared/components/ui';
import { useShadow } from '@/shared/theme';
import { GoogleIcon } from './google-icon';

export function GoogleButton({ onPress }: { onPress?: () => void }) {
  const t = useDictionary('Auth');
  const shadow = useShadow('card');
  return (
    <Button
      variant="outline"
      size="lg"
      onPress={onPress}
      style={shadow}
      className="h-[54px] w-full flex-row gap-3 rounded-lg border border-border bg-card"
    >
      <GoogleIcon size={21} />
      <Text className="font-sans-semibold text-[16.5px] text-foreground">
        {t('continueWithGoogle')}
      </Text>
    </Button>
  );
}
