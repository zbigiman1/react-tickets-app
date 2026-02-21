import type { i18n as I18nType } from 'i18next'
import { useEffect, useState } from 'react'

function readInitialLocale() {
  try {
    const stored = localStorage.getItem('i18nextLng')
    return stored || 'en'
  } catch {
    return 'en'
  }
}

export default function useLocale(i18n: I18nType | null = null) {
  const [locale, setLocale] = useState<string>(readInitialLocale)

  useEffect(() => {
    if (i18n) {
      i18n.changeLanguage(locale)
    }
    try {
      localStorage.setItem('i18nextLng', locale)
    } catch {
      /* empty */
    }
  }, [locale, i18n])

  return { locale, setLocale }
}
