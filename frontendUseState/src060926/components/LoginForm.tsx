import { useState } from 'react'

type LoginFormProps = {
  onLogin: (identifier: string, password: string) => Promise<void>
  onShowRegister: () => void
}

export function LoginForm({ onLogin, onShowRegister }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
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
    <form className="form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <label className="field">
        Usuario o email
        <input
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
        />
      </label>
      <label className="field">
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button disabled={isLoading}>{isLoading ? 'Ingresando...' : 'Ingresar'}</button>
      <p>
        ¿No tienes cuenta?{' '}
        <button className="link-button" type="button" onClick={onShowRegister}>
          Regístrate
        </button>
      </p>
    </form>
  )
}
