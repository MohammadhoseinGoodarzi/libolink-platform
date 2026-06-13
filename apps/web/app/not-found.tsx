import { getDictionary } from '@repo/i18n';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';

export default async function RootNotFound() {
  const t = await getDictionary('Common');
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">{t('notFound')}</h1>
      <Button asChild variant="outline">
        <Link href={ROUTES.landing}>{t('goHome')}</Link>
      </Button>
    </div>
  );
}
