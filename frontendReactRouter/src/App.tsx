import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { EmailVerificationForm } from './components/EmailVerificationForm'
import { AdminUsersPanel } from './components/AdminUsersPanel'
import { LoginForm } from './components/LoginForm'
import { PasswordRecoveryForm } from './components/PasswordRecoveryForm'
import { RegisterForm } from './components/RegisterForm'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { ThemeButton } from './components/ThemeButton'
import { UserCard } from './components/UserCard'
import { useTheme } from './hooks/useTheme'
import {
  getCurrentUser,
  login,
  logout,
  register,
  requestPasswordRecovery,
  resendEmailCode,
  resetPassword,
  verifyEmailCode,
  changePassword,
  deleteOwnAccount,
  updateProfilePicture,
  updateUsername,
} from './services/authApi'
import type { User } from './types/user'
import './App.css'

type ResetPasswordRouteProps = {
  onReset: (token: string, password: string) => Promise<void>
}

/** Obtiene el token desde la URL y muestra el formulario solo cuando existe. */
function ResetPasswordRoute({ onReset }: ResetPasswordRouteProps) {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token) return <Navigate to="/" replace />

  return (
    <section className="auth-box">
      <ResetPasswordForm token={token} onReset={onReset} />
    </section>
  )
}

function App() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<string | null>(null)
  const signedInPath = user?.email_verified_at ? '/cuenta' : '/verificar-email'

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsCheckingSession(false))
  }, [])

  async function handleLogin(identifier: string, password: string) {
    const response = await login(identifier, password)
    setUser(response.usuario)
    setVerificationExpiresAt(response.verificationExpiresAt)
    navigate(response.usuario.email_verified_at ? '/cuenta' : '/verificar-email')
  }

  async function handleRegister(username: string, email: string, password: string) {
    const response = await register(username, email, password)
    setUser(response.usuario)
    setVerificationExpiresAt(response.verificationExpiresAt)
    navigate('/verificar-email')
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      setUser(null)
      setMessage('Sesión cerrada.')
      navigate('/')
    }
  }

  async function handleResetPassword(token: string, password: string) {
    await resetPassword(token, password)
    setUser(null)
    setMessage('Contraseña restablecida. Inicia sesión nuevamente.')
    navigate('/', { replace: true })
  }

  async function refreshCurrentUser() {
    setUser(await getCurrentUser())
  }

  async function handleDeleteOwnAccount() {
    await deleteOwnAccount()
    setUser(null)
    setMessage('Tu cuenta se eliminó.')
    navigate('/', { replace: true })
  }

  if (isCheckingSession) {
    return <main className="page"><ThemeButton theme={theme} onToggle={toggleTheme} />Comprobando sesión...</main>
  }

  return (
    <main className="page">
      <ThemeButton theme={theme} onToggle={toggleTheme} />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={signedInPath} replace /> : (
            <section className="auth-box">
              {message && <p className="message">{message}</p>}
              <LoginForm
                onLogin={handleLogin}
                onShowRegister={() => navigate('/registro')}
                onShowPasswordRecovery={() => navigate('/recuperar-contrasena')}
              />
            </section>
          )}
        />
        <Route
          path="/registro"
          element={user ? <Navigate to={signedInPath} replace /> : (
            <section className="auth-box">
              <RegisterForm
                onRegister={handleRegister}
                onShowLogin={() => navigate('/')}
              />
            </section>
          )}
        />
        <Route
          path="/recuperar-contrasena"
          element={user ? <Navigate to={signedInPath} replace /> : (
            <section className="auth-box">
              <PasswordRecoveryForm onRequest={async (email) => (await requestPasswordRecovery(email)).message} onShowLogin={() => navigate('/')} />
            </section>
          )}
        />
        <Route path="/restablecer-contrasena" element={<ResetPasswordRoute onReset={handleResetPassword} />} />
        <Route
          path="/verificar-email"
          element={!user ? <Navigate to="/" replace /> : user.email_verified_at ? <Navigate to="/cuenta" replace /> : (
            <section className="auth-box">
              <EmailVerificationForm
                email={user.email}
                expiresAt={verificationExpiresAt}
                onVerify={async (code) => {
                  setUser(await verifyEmailCode(code))
                  navigate('/cuenta', { replace: true })
                }}
                onResend={async () => {
                  const response = await resendEmailCode()
                  setVerificationExpiresAt(response.expiresAt)
                  return response.expiresAt
                }}
              />
            </section>
          )}
        />
        <Route
          path="/cuenta"
          element={!user ? <Navigate to="/" replace /> : !user.email_verified_at ? <Navigate to="/verificar-email" replace /> : (
            <UserCard
              user={user}
              onLogout={handleLogout}
              onUpdateUsername={async (username) => { const updated = await updateUsername(username); setUser(updated); return updated }}
              onUpdateProfilePicture={async (picture) => { const updated = await updateProfilePicture(picture); setUser(updated); return updated }}
              onChangePassword={changePassword}
              onOpenAdmin={() => navigate('/admin')}
              onDeleteAccount={handleDeleteOwnAccount}
            />
          )}
        />
        <Route
          path="/admin"
          element={!user ? <Navigate to="/" replace /> : !user.email_verified_at ? <Navigate to="/verificar-email" replace /> : user.role !== 'admin' ? <Navigate to="/cuenta" replace /> : <AdminUsersPanel onBack={() => navigate('/cuenta')} onRefreshCurrentUser={refreshCurrentUser} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
