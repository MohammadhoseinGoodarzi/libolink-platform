'use client';

import { useDictionary } from '@repo/i18n';
import { Button } from '@/shared/components/ui/button';

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useDictionary('Common');
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">{t('genericError')}</p>
      <Button onClick={reset}>{t('retry')}</Button>
    </div>
  );
}
