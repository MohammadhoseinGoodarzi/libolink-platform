'use client';

import { useDictionary } from '@repo/i18n';
import { Button } from '@/shared/components/ui/button';

export function AuthError({ reset }: { reset: () => void }) {
  const t = useDictionary('Common');
  return (
    <div className="grid gap-4 text-center">
      <p className="text-destructive text-sm">{t('genericError')}</p>
      <Button variant="outline" onClick={reset}>
        {t('retry')}
      </Button>
    </div>
  );
}
