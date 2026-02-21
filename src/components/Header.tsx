import useLocale from '@/hooks/useLocale'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { locale, setLocale } = useLocale(i18n)

  return (
    <header className="header">
      <div className="header-content">
        <h1>{t('title')}</h1>
        <div className="locale-switcher">
          <button onClick={() => setLocale('en')} className={locale === 'en' ? 'active' : ''}>
            EN
          </button>
          <button onClick={() => setLocale('pl')} className={locale === 'pl' ? 'active' : ''}>
            PL
          </button>
        </div>
      </div>
    </header>
  )
}
