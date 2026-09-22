import { useAuth0 } from '@auth0/auth0-react'
import App from './App'

export function Auth0App() {
  const { error, isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  if (isLoading) {
    return <main className="page">Comprobando autenticación…</main>
  }

  if (error) {
    return <main className="page">No se pudo iniciar Auth0: {error.message}</main>
  }

  return (
    <App
      auth0={{
        isAuthenticated,
        user,
        login: () => loginWithRedirect({
          authorizationParams: { connection: 'google-oauth2' },
        }),
        signup: () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } }),
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
      }}
    />
  )
}
