import { useState } from 'react'

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
}

/** Campo reutilizable que permite mostrar u ocultar una contraseña. */
export function PasswordField({ label, value, onChange, autoComplete }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className="field">
      {label}
      <span className="password-control">
        <input type={isVisible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} />
        <button className="password-control__toggle" type="button" onClick={() => setIsVisible((visible) => !visible)} aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'} title={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          {isVisible ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
              <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.3 0 8.7 5.1 9.7 7.1a1.8 1.8 0 0 1 0 1.8 17.5 17.5 0 0 1-3 4" />
              <path d="M6.2 6.2a17.4 17.4 0 0 0-3.9 4.9 1.8 1.8 0 0 0 0 1.8C3.3 14.9 6.7 20 12 20a9.8 9.8 0 0 0 2.2-.3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.3 12.9a1.8 1.8 0 0 1 0-1.8C3.3 9.1 6.7 4 12 4s8.7 5.1 9.7 7.1a1.8 1.8 0 0 1 0 1.8C20.7 14.9 17.3 20 12 20S3.3 14.9 2.3 12.9z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </span>
    </label>
  )
}
