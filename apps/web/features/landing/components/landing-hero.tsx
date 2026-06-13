import { getDictionary } from '@repo/i18n';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';

export async function LandingHero() {
  const t = await getDictionary('Landing');
  return (
    <section className="flex min-h-[60svh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="max-w-2xl font-bold text-4xl tracking-tight sm:text-5xl">{t('headline')}</h1>
      <p className="max-w-xl text-lg text-muted-foreground">{t('subheadline')}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href={ROUTES.signup}>{t('getStarted')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.login}>{t('signIn')}</Link>
        </Button>
      </div>
    </section>
  );
}
