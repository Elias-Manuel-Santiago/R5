import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
}

/** Guarda el tema elegido y aplica la clase global que activa las variables CSS. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')) }
}
