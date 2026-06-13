import { getDictionary } from '@repo/i18n';

// RSC-first: renders server-side with awaited translations. The interactive
// composer/feed will mount as client containers nested here.
export async function HomeView() {
  const t = await getDictionary('Home');
  return (
    <section className="grid gap-6">
      <h1 className="font-semibold text-2xl">{t('feedTitle')}</h1>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {t('emptyFeed')}
      </div>
    </section>
  );
}
