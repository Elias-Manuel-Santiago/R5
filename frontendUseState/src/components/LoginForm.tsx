import { useState } from 'react'
import { AuthAlternatives } from './AuthAlternatives'
import { PasswordField } from './PasswordField'

type LoginFormProps = {
  onLogin: (identifier: string, password: string) => Promise<void>
  onShowRegister: () => void
  onShowPasswordRecovery: () => void
  onLoginWithGoogle?: () => Promise<void>
  onLoginWithGitHub?: () => Promise<void>
  onLoginWithApple?: () => Promise<void>
}

export function LoginForm({
  onLogin,
  onShowRegister,
  onShowPasswordRecovery,
  onLoginWithGoogle,
  onLoginWithGitHub,
  onLoginWithApple,
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const hasAlternatives = Boolean(onLoginWithGoogle || onLoginWithGitHub || onLoginWithApple)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Completa usuario o email y contraseña.')
      return
    }

    setIsLoading(true)

    try {
      await onLogin(identifier, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={`auth-form${hasAlternatives ? ' auth-form--with-alternatives' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="auth-form__main">
        <h1>Iniciar sesión</h1>
        <label className="field">
          Usuario o email
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
        </label>
        <PasswordField label="Contraseña" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <p className="error">{error}</p>}
        <button disabled={isLoading}>{isLoading ? 'Ingresando...' : 'Ingresar'}</button>
        <p>¿No tienes cuenta? <button className="link-button" type="button" onClick={onShowRegister}>Regístrate</button></p>
        <button className="link-button" type="button" onClick={onShowPasswordRecovery}>Olvidé mi contraseña</button>
      </div>
      <AuthAlternatives
        mode="login"
        onLoginWithGoogle={onLoginWithGoogle}
        onLoginWithGitHub={onLoginWithGitHub}
        onLoginWithApple={onLoginWithApple}
      />
    </form>
  )
}
