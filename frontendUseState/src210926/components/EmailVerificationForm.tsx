import { useEffect, useState } from 'react'

type EmailVerificationFormProps = {
  email: string
  expiresAt: string | null
  onVerify: (code: string) => Promise<void>
  onResend: () => Promise<string>
}

function secondsUntil(expiresAt: string | null) {
  if (!expiresAt) return 0
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000))
}

function formatTime(seconds: number) {
  return `00:${seconds.toString().padStart(2, '0')}`
}

export function EmailVerificationForm({ email, expiresAt, onVerify, onResend }: EmailVerificationFormProps) {
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt))
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSecondsLeft(secondsUntil(expiresAt))
  }, [expiresAt])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft(secondsUntil(expiresAt))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [expiresAt])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!/^\d{6}$/.test(code)) {
      setError('El código debe tener 6 dígitos.')
      return
    }

    setIsLoading(true)

    try {
      await onVerify(code)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo verificar el código.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setIsLoading(true)

    try {
      const newExpiresAt = await onResend()
      setSecondsLeft(secondsUntil(newExpiresAt))
      setCode('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo reenviar el código.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Verifica tu correo</h2>
      <p>Enviamos un código de 6 dígitos a <strong>{email}</strong>.</p>
      <label className="field">
        Código
        <input
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
        />
      </label>
      {secondsLeft > 0 ? (
        <p>El código expira en: <strong>{formatTime(secondsLeft)}</strong></p>
      ) : (
        <p>El código expiró. Solicita uno nuevo.</p>
      )}
      {error && <p className="error">{error}</p>}
      <button disabled={isLoading || secondsLeft === 0}>
        {isLoading ? 'Verificando...' : 'Verificar correo'}
      </button>
      <button type="button" className="link-button" onClick={handleResend} disabled={isLoading || secondsLeft > 0}>
        Reenviar código
      </button>
    </form>
  )
}
