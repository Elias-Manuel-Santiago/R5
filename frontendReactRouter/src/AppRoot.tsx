import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Auth0App } from './Auth0App'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

export function AppRoot() {
  // Keep the existing local login usable until the public Auth0 SPA settings are supplied.
  if (!domain || !clientId) {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: 'openid profile email',
      }}
    >
      <BrowserRouter>
        <Auth0App />
      </BrowserRouter>
    </Auth0Provider>
  )
}
