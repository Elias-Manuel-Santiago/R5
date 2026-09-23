import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import { Auth0App } from './Auth0App'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

export function AppRoot() {
  // El login local sigue disponible hasta contar con la configuración pública de Auth0.
  if (!domain || !clientId) return <App />

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback
      authorizationParams={{ redirect_uri: window.location.origin, scope: 'openid profile email' }}
    >
      <Auth0App />
    </Auth0Provider>
  )
}
