import type { User } from '@auth0/auth0-react'

type Auth0UserCardProps = {
  user: User | undefined
  onLogout: () => void
}

function isDisplayName(value: string | undefined, email: string | undefined): value is string {
  return Boolean(value?.trim() && value.trim().toLocaleLowerCase() !== email?.trim().toLocaleLowerCase())
}

function getDisplayName(user: User | undefined) {
  const fullName = [user?.given_name, user?.family_name]
    .filter((value): value is string => isDisplayName(value, user?.email))
    .join(' ')

  return [fullName, user?.name, user?.nickname, user?.preferred_username]
    .find((value) => isDisplayName(value, user?.email)) ?? 'Usuario de Auth0'
}

export function Auth0UserCard({ user, onLogout }: Auth0UserCardProps) {
  const displayName = getDisplayName(user)

  return (
    <section className="user-card" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Sesión iniciada</h1>
      {user?.picture && <img src={user.picture} alt="" className="profile-picture" referrerPolicy="no-referrer" />}
      <p><strong>Usuario:</strong> {displayName}</p>
      {user?.email && <p><strong>Email:</strong> {user.email}</p>}
      <p className="form-hint">Los datos de perfiles sociales se administran desde su proveedor de acceso.</p>
      <button type="button" onClick={onLogout}>Cerrar sesión</button>
    </section>
  )
}
