'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
      <button
        onClick={() => switchLocale('de')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'de'
            ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
