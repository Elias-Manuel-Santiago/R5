import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { UserCard } from './components/UserCard'
import { login, register } from './services/authApi'
import type { User } from './types/user'
import './App.css'

type View = 'login' | 'register'

function App() {
  // Toda la navegación se resuelve con estado, sin usar React Router.
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')

  async function handleLogin(identifier: string, password: string) {
    const loggedUser = await login(identifier, password)
    setUser(loggedUser)
    setMessage('')
  }

  async function handleRegister(username: string, email: string, password: string) {
    await register(username, email, password)
    setView('login')
    setMessage('Registro completado. Ya puedes iniciar sesión.')
  }

  function handleLogout() {
    setUser(null)
    setMessage('Sesión cerrada.')
  }

  if (user) {
    return (
      <main className="page">
        <UserCard user={user} onLogout={handleLogout} />
      </main>
    )
  }

  return (
    <main className="page">
      <section className="auth-box" aria-labelledby="title">
        <h1 id="title">Sistema de usuarios</h1>
        {message && <p className="message">{message}</p>}

        {view === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onShowRegister={() => {
              setMessage('')
              setView('register')
            }}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onShowLogin={() => {
              setMessage('')
              setView('login')
            }}
          />
        )}
      </section>
    </main>
  )
}

export default App
