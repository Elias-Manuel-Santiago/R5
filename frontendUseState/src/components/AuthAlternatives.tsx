type AuthAlternativesProps = {
  onLoginWithGoogle?: () => Promise<void>
  onLoginWithGitHub?: () => Promise<void>
  onLoginWithApple?: () => Promise<void>
  mode: 'login' | 'register'
}

export function AuthAlternatives({
  onLoginWithGoogle,
  onLoginWithGitHub,
  onLoginWithApple,
  mode,
}: AuthAlternativesProps) {
  if (!onLoginWithGoogle && !onLoginWithGitHub && !onLoginWithApple) return null

  const action = mode === 'login' ? 'Continuar' : 'Registrarte'

  return (
    <aside className="auth-alternatives" aria-label="Opciones alternativas de acceso">
      <div className="auth-alternatives__heading">
        <span aria-hidden="true" />
        <p>O {mode === 'login' ? 'continúa' : 'regístrate'} con</p>
        <span aria-hidden="true" />
      </div>
      <div className="auth-alternatives__options">
        {onLoginWithGoogle && (
          <button className="social-login-button" type="button" onClick={() => void onLoginWithGoogle()}>
            <img className="social-login-button__logo" src="/logoGoogle.png" alt="" aria-hidden="true" />
            {action} con Google
          </button>
        )}
        {onLoginWithGitHub && (
          <button className="social-login-button" type="button" onClick={() => void onLoginWithGitHub()}>
            <img className="social-login-button__logo social-login-button__logo--light" src="/logoGitHubNegro.png" alt="" aria-hidden="true" />
            <img className="social-login-button__logo social-login-button__logo--dark" src="/logoGitHubBlanco.png" alt="" aria-hidden="true" />
            {action} con GitHub
          </button>
        )}
        {onLoginWithApple && (
          <button className="social-login-button" type="button" onClick={() => void onLoginWithApple()}>
            <img className="social-login-button__logo social-login-button__logo--light" src="/logoAppleNegro.png" alt="" aria-hidden="true" />
            <img className="social-login-button__logo social-login-button__logo--dark" src="/logoAppleBlanco.png" alt="" aria-hidden="true" />
            {action} con Apple
          </button>
        )}
      </div>
    </aside>
  )
}
