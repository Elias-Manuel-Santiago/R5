import type { User } from '../types/user'

type UserCardProps = {
  user: User
  onLogout: () => void
}

export function UserCard({ user, onLogout }: UserCardProps) {
  return (
    <section className="user-card" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Sesión iniciada</h1>
      <p>
        <strong>Usuario:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.id && (
        <p>
          <strong>ID:</strong> {user.id}
        </p>
      )}
      <button type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </section>
  )
}
