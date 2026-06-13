import { useDictionary } from '@repo/i18n';

export function AuthLoading() {
  const t = useDictionary('Common');
  return (
    <div className="grid gap-4" aria-busy="true">
      <div className="h-8 animate-pulse rounded-md bg-muted" />
      <div className="h-[42px] animate-pulse rounded-md bg-muted" />
      <div className="h-[42px] animate-pulse rounded-md bg-muted" />
      <span className="sr-only">{t('loading')}</span>
    </div>
  );
}
