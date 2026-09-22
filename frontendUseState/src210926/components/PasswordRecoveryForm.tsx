import { useState } from 'react'
import { getEmailError } from '../utils/password'

type PasswordRecoveryFormProps = {
  onRequest: (email: string) => Promise<string>
  onShowLogin: () => void
}

/** Formulario que solicita el enlace de recuperación sin revelar si el email existe. */
export function PasswordRecoveryForm({ onRequest, onShowLogin }: PasswordRecoveryFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const emailError = getEmailError(email)
    if (emailError) {
      setError(emailError)
      return
    }

    setIsLoading(true)

    try {
      setMessage(await onRequest(email))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo solicitar el enlace.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Recuperar contraseña</h2>
      <p>Ingresa tu email y te enviaremos un enlace único.</p>
      <label className="field">
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <button disabled={isLoading}>{isLoading ? 'Enviando...' : 'Enviar enlace'}</button>
      <button type="button" className="link-button" onClick={onShowLogin}>
        Volver a iniciar sesión
      </button>
    </form>
  )
}
