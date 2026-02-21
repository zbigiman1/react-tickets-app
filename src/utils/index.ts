import i18n from 'i18next'

export function formatDate(dateString: string): string {
  const locale = i18n.language
  let dateFormat = 'pl-PL'
  if (locale === 'en') {
    dateFormat = 'en-US'
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(dateFormat, options)
}
