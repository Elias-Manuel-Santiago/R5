import { useState } from 'react'

type RegisterFormProps = {
  onRegister: (username: string, email: string, password: string) => Promise<void>
  onShowLogin: () => void
}

export function RegisterForm({ onRegister, onShowLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    // Esta validación es del formulario; la contraseña nunca se envía dos veces a la API.
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
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
    <form className="form" onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <label className="field">
        Usuario
        <input value={username} onChange={(event) => setUsername(event.target.value)} required />
      </label>
      <label className="field">
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="field">
        Contraseña
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <label className="field">
        Confirmar contraseña
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button disabled={isLoading}>{isLoading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
      <p>
        ¿Ya tienes cuenta?{' '}
        <button className="link-button" type="button" onClick={onShowLogin}>
          Inicia sesión
        </button>
      </p>
    </form>
  )
}
