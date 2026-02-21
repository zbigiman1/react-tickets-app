import { useTranslation } from 'react-i18next'

type Props = {
  error?: string | Error | null
}

export default function ErrorMessage({ error }: Props) {
  const { t } = useTranslation()
  const message = typeof error === 'string' ? error : error instanceof Error ? error.message : ''

  return (
    <div className="error-message">
      <p>
        {t('somethingWentWrong')}
        {message ? ` ${message}` : ''}
      </p>
    </div>
  )
}
