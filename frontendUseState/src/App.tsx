import { useEffect, useState } from 'react'
import type { User as Auth0User } from '@auth0/auth0-react'
import { AdminUsersPanel } from './components/AdminUsersPanel'
import { Auth0UserCard } from './components/Auth0UserCard'
import { EmailVerificationForm } from './components/EmailVerificationForm'
import { LoginForm } from './components/LoginForm'
import { PasswordRecoveryForm } from './components/PasswordRecoveryForm'
import { RegisterForm } from './components/RegisterForm'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { ThemeButton } from './components/ThemeButton'
import { UserCard } from './components/UserCard'
import { useTheme } from './hooks/useTheme'
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  register,
  requestPasswordRecovery,
  resendEmailCode,
  resetPassword,
  updateProfilePicture,
  updateUsername,
  verifyEmailCode,
} from './services/authApi'
import type { User } from './types/user'
import './App.css'

type View = 'login' | 'register' | 'passwordRecovery' | 'resetPassword' | 'emailVerification' | 'account' | 'auth0Account' | 'admin'

type Auth0Session = {
  isAuthenticated: boolean
  user: Auth0User | undefined
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  loginWithApple: () => Promise<void>
  logout: () => void
}

type AppProps = {
  auth0?: Auth0Session
}

function getResetToken() {
  const params = new URLSearchParams(window.location.search)
  return window.location.pathname === '/restablecer-contrasena' ? params.get('token') : null
}

function App({ auth0 }: AppProps) {
  const { theme, toggleTheme } = useTheme()
  // Toda la navegación se resuelve con estado, sin usar React Router.
  const [view, setView] = useState<View>(() => getResetToken() ? 'resetPassword' : 'login')
  const [resetToken, setResetToken] = useState(getResetToken)
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<string | null>(null)
  const hasAuthAlternatives = Boolean(auth0?.loginWithGoogle || auth0?.loginWithGitHub || auth0?.loginWithApple)

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
        setView(currentUser.email_verified_at ? 'account' : 'emailVerification')
      })
      .catch(() => setUser(null))
      .finally(() => setIsCheckingSession(false))
  }, [])

  async function handleLogin(identifier: string, password: string) {
    const response = await login(identifier, password)
    setUser(response.usuario)
    setVerificationExpiresAt(response.verificationExpiresAt)
    setMessage('')
    setView(response.usuario.email_verified_at ? 'account' : 'emailVerification')
  }

  async function handleRegister(username: string, email: string, password: string) {
    const response = await register(username, email, password)
    setUser(response.usuario)
    setVerificationExpiresAt(response.verificationExpiresAt)
    setMessage('')
    setView('emailVerification')
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      setUser(null)
      setMessage('Sesión cerrada.')
      setView('login')
    }
  }

  async function refreshCurrentUser() {
    setUser(await getCurrentUser())
  }

  async function handleResetPassword(token: string, password: string) {
    await resetPassword(token, password)
    window.history.replaceState({}, '', '/')
    setResetToken(null)
    setUser(null)
    setMessage('Contraseña restablecida. Inicia sesión nuevamente.')
    setView('login')
  }

  function show(viewToShow: View) {
    setMessage('')
    setView(viewToShow)
  }

  if (isCheckingSession) {
    return <main className="page"><ThemeButton theme={theme} onToggle={toggleTheme} />Comprobando sesión...</main>
  }

  let content: React.ReactNode

  if (view === 'resetPassword') {
    content = resetToken ? (
      <section className="auth-box"><ResetPasswordForm token={resetToken} onReset={handleResetPassword} /></section>
    ) : null
  } else if (user && !user.email_verified_at) {
    content = (
      <section className="auth-box">
        <EmailVerificationForm
          email={user.email}
          expiresAt={verificationExpiresAt}
          onVerify={async (code) => { setUser(await verifyEmailCode(code)); setView('account') }}
          onResend={async () => {
            const response = await resendEmailCode()
            setVerificationExpiresAt(response.expiresAt)
            return response.expiresAt
          }}
        />
      </section>
    )
  } else if (view === 'admin' && user?.role === 'admin') {
    content = <AdminUsersPanel onBack={() => setView('account')} onRefreshCurrentUser={refreshCurrentUser} />
  } else if (user) {
    content = (
      <UserCard
        user={user}
        onLogout={handleLogout}
        onUpdateUsername={async (username) => { const updated = await updateUsername(username); setUser(updated); return updated }}
        onUpdateProfilePicture={async (picture) => { const updated = await updateProfilePicture(picture); setUser(updated); return updated }}
        onChangePassword={changePassword}
        onOpenAdmin={() => setView('admin')}
      />
    )
  } else if (auth0?.isAuthenticated && (view === 'login' || view === 'auth0Account')) {
    content = <Auth0UserCard user={auth0.user} onLogout={auth0.logout} />
  } else if (view === 'register') {
    content = (
      <section className={`auth-box${hasAuthAlternatives ? ' auth-box--with-alternatives' : ''}`}>
        <RegisterForm
          onRegister={handleRegister}
          onShowLogin={() => show('login')}
          onLoginWithGoogle={auth0?.loginWithGoogle}
          onLoginWithGitHub={auth0?.loginWithGitHub}
          onLoginWithApple={auth0?.loginWithApple}
        />
      </section>
    )
  } else if (view === 'passwordRecovery') {
    content = (
      <section className="auth-box">
        <PasswordRecoveryForm onRequest={async (email) => (await requestPasswordRecovery(email)).message} onShowLogin={() => show('login')} />
      </section>
    )
  } else {
    content = (
      <section className={`auth-box${hasAuthAlternatives ? ' auth-box--with-alternatives' : ''}`}>
        {message && <p className="message">{message}</p>}
        <LoginForm
          onLogin={handleLogin}
          onShowRegister={() => show('register')}
          onShowPasswordRecovery={() => show('passwordRecovery')}
          onLoginWithGoogle={auth0?.loginWithGoogle}
          onLoginWithGitHub={auth0?.loginWithGitHub}
          onLoginWithApple={auth0?.loginWithApple}
        />
      </section>
    )
  }

  return <main className="page"><ThemeButton theme={theme} onToggle={toggleTheme} />{content}</main>
}

export default App
