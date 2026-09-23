import { useAuth0 } from '@auth0/auth0-react'
import App from './App'

export function Auth0App() {
  const { error, isAuthenticated, isLoading, loginWithPopup, logout, user } = useAuth0()

  function loginInNewTab(connection: string) {
    const popup = window.open('', '_blank')
    return loginWithPopup(
      { authorizationParams: { connection } },
      { popup, timeoutInSeconds: 300 },
    )
  }

  if (isLoading) return <main className="page">Comprobando autenticación…</main>
  if (error) return <main className="page">No se pudo iniciar Auth0: {error.message}</main>

  return (
    <App
      auth0={{
        isAuthenticated,
        user,
        loginWithGoogle: () => loginInNewTab('google-oauth2'),
        loginWithGitHub: () => loginInNewTab('github'),
        loginWithApple: () => loginInNewTab('apple'),
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
      }}
    />
  )
}
