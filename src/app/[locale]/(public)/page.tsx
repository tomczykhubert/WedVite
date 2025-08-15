"use client";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routes } from '@/lib/routes/routes';
import { Button } from '@/components/ui/button';
 
export default function HomePage() {
  const t = useTranslations();
  return (
    <div>
      <div>
        <Link href={routes.auth.signIn}>{t('user.signIn')}</Link>
      </div>
    </div>
  );
}