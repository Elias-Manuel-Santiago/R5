type ThemeButtonProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

/** Botón accesible para alternar el tema visual de toda la aplicación. */
export function ThemeButton({ theme, onToggle }: ThemeButtonProps) {
  const nextTheme = theme === 'dark' ? 'claro' : 'oscuro'

  return (
    <button className="theme-button" type="button" onClick={onToggle} aria-label={`Cambiar al tema ${nextTheme}`} title={`Cambiar al tema ${nextTheme}`}>
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
