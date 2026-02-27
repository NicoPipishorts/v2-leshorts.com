import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

const LANGUAGE_STORAGE_KEY = 'preferredLanguage'
const SUPPORTED_LANGUAGES = ['en', 'fr'] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const normalizeLanguage = (
  value?: string | null,
): SupportedLanguage | null => {
  if (!value) {
    return null
  }

  const baseLanguage = value.toLowerCase().split('-')[0] as SupportedLanguage
  return SUPPORTED_LANGUAGES.includes(baseLanguage) ? baseLanguage : null
}

const getStoredLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
  } catch {
    return null
  }
}

const getBrowserLanguage = (): SupportedLanguage | null => {
  if (typeof navigator === 'undefined') {
    return null
  }

  const candidates = [...(navigator.languages ?? []), navigator.language]

  for (const candidate of candidates) {
    const normalized = normalizeLanguage(candidate)
    if (normalized) {
      return normalized
    }
  }

  return null
}

const getInitialLanguage = (): SupportedLanguage =>
  getStoredLanguage() ?? getBrowserLanguage() ?? 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (language) => {
  if (typeof window === 'undefined') {
    return
  }

  const normalized = normalizeLanguage(language)
  if (!normalized) {
    return
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized)
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }
})

export default i18n
