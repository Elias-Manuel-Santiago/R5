import type { User } from '@auth0/auth0-react'

type Auth0UserCardProps = {
  user: User | undefined
  onLogout: () => void
}

export function Auth0UserCard({ user, onLogout }: Auth0UserCardProps) {
  return (
    <section className="user-card" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Sesión iniciada</h1>
      {user?.picture && <img src={user.picture} alt="" className="profile-picture" referrerPolicy="no-referrer" />}
      <p>
        <strong>Usuario:</strong> {user?.name ?? user?.nickname ?? 'Usuario de Auth0'}
      </p>
      {user?.email && (
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      )}
      <button type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </section>
  )
}
