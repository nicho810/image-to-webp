import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { I18nKey, InterpolationVars, Locale, TranslationMap } from './types'
import { SUPPORTED_LOCALES } from './types'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import ja from './locales/ja'
import zhTW from './locales/zh-TW'

const STORAGE_KEY = 'image-to-webp:locale'

const TRANSLATIONS: Record<Locale, TranslationMap> = {
  en,
  ja,
  'zh-TW': zhTW,
  de,
  fr,
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  'zh-TW': '繁體中文',
  de: 'Deutsch',
  fr: 'Français',
}

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

function interpolate(template: string, vars?: InterpolationVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key]
    if (value === undefined || value === null) return match
    return String(value)
  })
}

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: I18nKey, vars?: InterpolationVars) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isLocale(stored)) return stored
    return 'en'
  })

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback(
    (key: I18nKey, vars?: InterpolationVars) => {
      const template = TRANSLATIONS[locale][key] ?? TRANSLATIONS.en[key] ?? key
      return interpolate(template, vars)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider />')
  return ctx
}
