/**
 * SettingsContext
 * --------------------------------------------------------------------------
 * Global UI preferences: language ('en' | 'fr') and theme ('light' | 'dark').
 *
 * Persistence model (three layers, most specific wins):
 *   1. URL query params (?lang=fr&theme=dark) — shareable quote links
 *   2. localStorage — the visitor's last choice, restored on return
 *   3. the OS color-scheme preference — used on a first visit for the theme
 *
 * The theme is applied as data-theme on <html>; the CSS in styles/tokens.css
 * reacts to that attribute. The provider also exposes t(), the translation
 * function used by every component: t('some.key') or t('key', { param }).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { translations } from '../i18n/translations'

const SettingsContext = createContext(null)

function getInitialLang() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('lang') === 'fr' || params.get('lang') === 'en') {
    return params.get('lang')
  }
  return localStorage.getItem('lang') === 'fr' ? 'fr' : 'en'
}

function getInitialTheme() {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('theme')
  if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl

  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function SettingsProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply + persist the theme on the <html> element (CSS keys off data-theme).
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Apply + persist the language and keep the document title translated.
  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
    document.title = translations[lang]['app.title']
  }, [lang])

  /** Translate a key, interpolating {{param}} values when provided. */
  const t = useCallback(
    (key, params) => {
      let str = translations[lang][key] ?? translations.en[key] ?? key
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          str = str.replaceAll(`{{${name}}}`, value)
        }
      }
      return str
    },
    [lang],
  )

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, theme, toggleTheme, t }),
    [lang, theme, toggleTheme, t],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used inside a <SettingsProvider>')
  }
  return ctx
}
