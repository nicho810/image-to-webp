import { Select } from '../vibe-design-system/components'
import { LOCALE_LABELS, useI18n } from '../i18n/i18n'
import { SUPPORTED_LOCALES, type Locale } from '../i18n/types'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <Select
      className="vds-select--auto"
      aria-label={t('header.language')}
      value={locale}
      onChange={e => setLocale(e.target.value as Locale)}
    >
      {SUPPORTED_LOCALES.map(l => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </Select>
  )
}

