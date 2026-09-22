import { useTema } from './useTheme'
import './ThemeButton.css'

function ThemeButton() {
  const { tema, toggleTema } = useTema()
  // Las ayudas de accesibilidad describen el modo al que cambiará el botón.
  const nextTheme = tema === 'dark' ? 'claro' : 'oscuro'

  return (
    <button
      className="theme-button"
      type="button"
      onClick={toggleTema}
      aria-label={`Cambiar al modo ${nextTheme}`}
      aria-pressed={tema === 'dark'}
      title={`Cambiar al modo ${nextTheme}`}
    >
      {tema === 'dark' ? (
        <svg className="theme-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg className="theme-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeButton
