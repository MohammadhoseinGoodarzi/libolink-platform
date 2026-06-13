import { useDictionary } from '@repo/i18n';
import { Button } from '@/shared/components/ui/button';

// lucide v1 removed brand icons, so social providers render as labelled
// outline buttons. Brand SVGs from public/assets/icons can be slotted in later.
export function SocialAuthButtons() {
  const t = useDictionary('Auth');
  return (
    <div className="grid gap-2">
      <Button variant="outline" className="w-full">
        {t('continueWithApple')}
      </Button>
      <Button variant="outline" className="w-full">
        {t('continueWithGoogle')}
      </Button>
    </div>
  );
}
