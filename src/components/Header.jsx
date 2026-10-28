/**
 * Header
 * --------------------------------------------------------------------------
 * The app's top bar: logo mark, translated title/tagline, and the three
 * controls (language EN/FR, light/dark theme, print quote).
 *
 * All text comes from the i18n dictionary via the `t()` helper exposed by
 * SettingsContext; the theme/language state itself lives in that context,
 * so this component only renders controls and dispatches changes.
 *
 * Customization:
 *  - Logo colors are CSS classes (.brand-mark-* in Header.css), which read
 *    the design tokens — change tokens in styles/tokens.css to re-brand.
 *  - The icon shapes are inline SVG; swap the <svg> block to change the mark.
 */
import { useSettings } from '../context/SettingsContext'
import { LANGUAGES } from '../i18n/translations'
import './Header.css'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="2.5" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21.5" y2="12" />
        <line x1="5.2" y1="5.2" x2="6.9" y2="6.9" />
        <line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
        <line x1="18.8" y1="5.2" x2="17.1" y2="6.9" />
        <line x1="6.9" y1="17.1" x2="5.2" y2="18.8" />
      </g>
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7v-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header({ onPrint }) {
  const { lang, setLang, theme, toggleTheme, t } = useSettings()

  return (
    <header className="site-header">
      <div className="brand">
        {/* Brand mark — strokes are styled in Header.css, never hardcoded */}
        <svg
          className="brand-mark"
          viewBox="0 0 64 64"
          width="40"
          height="40"
          aria-hidden="true"
        >
          <rect className="brand-mark-bg" width="64" height="64" rx="14" />
          <rect
            className="brand-mark-primary"
            x="14"
            y="12"
            width="36"
            height="40"
            rx="5"
            fill="none"
            strokeWidth="3.5"
          />
          <line className="brand-mark-primary" x1="22" y1="24" x2="42" y2="24" strokeWidth="3" strokeLinecap="round" />
          <line className="brand-mark-muted" x1="22" y1="33" x2="42" y2="33" strokeWidth="3" strokeLinecap="round" />
          <line className="brand-mark-muted" x1="22" y1="42" x2="34" y2="42" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div>
          <h1>{t('header.title')}</h1>
          <p className="tagline">{t('header.tagline')}</p>
        </div>
      </div>

      <div className="header-controls no-print">
        {/* Language switch */}
        <div className="lang-toggle" role="group" aria-label={t('header.langLabel')}>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`lang-btn ${lang === language.code ? 'lang-btn-active' : ''}`}
              onClick={() => setLang(language.code)}
              aria-pressed={lang === language.code}
              title={language.name}
            >
              {language.label}
            </button>
          ))}
        </div>

        {/* Light / dark theme switch */}
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? t('header.themeToLight') : t('header.themeToDark')
          }
          title={theme === 'dark' ? t('header.themeToLight') : t('header.themeToDark')}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Browser print dialog → save the quotation as PDF */}
        <button
          type="button"
          className="theme-toggle print-button"
          onClick={onPrint}
          aria-label={t('header.print')}
          title={t('header.print')}
        >
          <PrintIcon />
        </button>

        <span className="tech-badge">{t('header.badge')}</span>
      </div>
    </header>
  )
}
