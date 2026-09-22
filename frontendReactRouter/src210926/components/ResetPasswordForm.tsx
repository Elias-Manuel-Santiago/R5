import { useState } from 'react'
import { PasswordField } from './PasswordField'
import { getPasswordError } from '../utils/password'

type ResetPasswordFormProps = {
  token: string
  onReset: (token: string, password: string) => Promise<void>
}

/** Permite elegir una contraseña nueva usando el token recibido por email. */
export function ResetPasswordForm({ token, onReset }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const passwordError = getPasswordError(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)
    try {
      await onReset(token, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo restablecer la contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Crea una contraseña nueva</h2>
      <PasswordField label="Nueva contraseña" value={password} onChange={setPassword} autoComplete="new-password" />
      <p className="form-hint">Mínimo 8 caracteres, con letras y números.</p>
      <PasswordField label="Confirmar contraseña" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
      {error && <p className="error">{error}</p>}
      <button disabled={isLoading}>{isLoading ? 'Guardando...' : 'Restablecer contraseña'}</button>
    </form>
  )
}
