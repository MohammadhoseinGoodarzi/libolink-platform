import { getDictionary } from '@repo/i18n';

export default async function RootLoading() {
  const t = await getDictionary('Common');
  return (
    <div className="flex min-h-svh items-center justify-center" aria-busy="true">
      <p className="animate-pulse text-muted-foreground">{t('loading')}</p>
    </div>
  );
}
