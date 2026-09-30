import { useState } from 'react'
import { PasswordField } from './PasswordField'
import { getEmailError, getPasswordError, getUsernameError } from '../utils/password'

type RegisterFormProps = {
  onRegister: (username: string, email: string, password: string) => Promise<void>
  onShowLogin: () => void
}

export function RegisterForm({
  onRegister,
  onShowLogin,
}: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const usernameError = getUsernameError(username)
    if (usernameError) {
      setError(usernameError)
      return
    }

    const emailError = getEmailError(email)
    if (emailError) {
      setError(emailError)
      return
    }

    // Esta validación es del formulario; la contraseña nunca se envía dos veces a la API.
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
      await onRegister(username, email, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo crear la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form__main">
        <h1>Registrarse</h1>
        <label className="field">
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="field">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <PasswordField label="Contraseña" value={password} onChange={setPassword} autoComplete="new-password" />
        <p className="form-hint">Mínimo 8 caracteres, con letras y números.</p>
        <PasswordField label="Confirmar contraseña" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        {error && <p className="error">{error}</p>}
        <button disabled={isLoading}>{isLoading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        <p>
          ¿Ya tienes cuenta?{' '}
          <button className="link-button" type="button" onClick={onShowLogin}>
            Inicia sesión
          </button>
        </p>
      </div>
    </form>
  )
}
