import { useEffect, useState } from 'react'
import type { AdminUser } from '../types/user'
import { deleteAdminUser, getAdminUsers, updateAdminUser } from '../services/authApi'
import { getUsernameError } from '../utils/password'
import { readProfilePicture } from '../utils/profilePicture'

type AdminUsersPanelProps = {
  onBack: () => void
  onRefreshCurrentUser: () => Promise<void>
}

export function AdminUsersPanel({ onBack, onRefreshCurrentUser }: AdminUsersPanelProps) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [userPendingDeletion, setUserPendingDeletion] = useState<AdminUser | null>(null)

  async function loadUsers(search = query) {
    try {
      setError('')
      setIsLoading(true)
      setUsers(await getAdminUsers(search))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar la lista de usuarios.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true
    getAdminUsers('')
      .then((loadedUsers) => { if (isCurrent) setUsers(loadedUsers) })
      .catch((caught) => { if (isCurrent) setError(caught instanceof Error ? caught.message : 'No se pudo cargar la lista de usuarios.') })
      .finally(() => { if (isCurrent) setIsLoading(false) })
    return () => { isCurrent = false }
  }, [])

  async function saveUser(id: number, changes: { username?: string; profilePicture?: string | null }) {
    const updated = await updateAdminUser(id, changes)
    setUsers((current) => current.map((user) => user.id === id ? updated : user))
    await onRefreshCurrentUser()
    setMessage('Usuario actualizado.')
  }

  async function removeUser() {
    if (!userPendingDeletion) return
    try {
      await deleteAdminUser(userPendingDeletion.id)
      setUsers((current) => current.filter((user) => user.id !== userPendingDeletion.id))
      setMessage('Usuario eliminado.')
      setUserPendingDeletion(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo eliminar el usuario.')
    }
  }

  return (
    <section className="admin-panel" aria-labelledby="admin-title">
      <div className="admin-panel__header">
        <h1 id="admin-title">Administrar usuarios</h1>
        <button type="button" className="secondary-button" onClick={onBack}>Volver a mi cuenta</button>
      </div>
      <form className="admin-search" onSubmit={(event) => { event.preventDefault(); void loadUsers(query) }}>
        <label className="field">Buscar por nombre o email<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. ana o ana@email.com" /></label>
        <button>Buscar</button>
      </form>
      {message && <p className="message" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {isLoading ? <p>Cargando usuarios…</p> : users.length === 0 ? <p>No hay usuarios que coincidan.</p> : <div className="admin-users">{users.map((user) => <AdminUserRow key={user.id} user={user} onSave={saveUser} onDelete={() => setUserPendingDeletion(user)} onError={setError} />)}</div>}
      {userPendingDeletion && <DeleteUserDialog user={userPendingDeletion} onCancel={() => setUserPendingDeletion(null)} onConfirm={removeUser} />}
    </section>
  )
}

type AdminUserRowProps = {
  user: AdminUser
  onSave: (id: number, changes: { username?: string; profilePicture?: string | null }) => Promise<void>
  onDelete: () => void
  onError: (message: string) => void
}

function AdminUserRow({ user, onSave, onDelete, onError }: AdminUserRowProps) {
  const [username, setUsername] = useState(user.username)
  const [picture, setPicture] = useState<string | null>(user.profile_picture)
  const [isSaving, setIsSaving] = useState(false)

  async function saveUsername() {
    const validationError = getUsernameError(username)
    if (validationError) return onError(validationError)
    try {
      setIsSaving(true)
      await onSave(user.id, { username: username.trim() })
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : 'No se pudo actualizar el nombre.')
    } finally {
      setIsSaving(false)
    }
  }

  async function choosePicture(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setPicture(await readProfilePicture(event.target.files?.[0]))
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : 'No se pudo cargar la imagen.')
    }
  }

  async function savePicture() {
    if (!picture) return onError('Selecciona una imagen antes de guardar.')
    try {
      setIsSaving(true)
      await onSave(user.id, { profilePicture: picture })
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : 'No se pudo actualizar la foto.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="admin-user">
      <div className="admin-user__summary">
        {picture ? <img className="profile-picture" src={picture} alt={`Foto de ${user.username}`} /> : <span className="profile-picture profile-picture--placeholder" aria-hidden="true">{user.username.slice(0, 1).toUpperCase()}</span>}
        <p><strong>ID:</strong> {user.id}<br /><strong>Email:</strong> {user.email}<br /><strong>Rol:</strong> {user.role}</p>
      </div>
      <label className="field">Nombre de usuario<input value={username} onChange={(event) => setUsername(event.target.value)} /></label>
      <button type="button" onClick={() => void saveUsername()} disabled={isSaving}>Guardar nombre</button>
      <label className="field">Cambiar foto<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={choosePicture} /></label>
      <button type="button" onClick={() => void savePicture()} disabled={isSaving || !picture}>Guardar foto</button>
      <button type="button" className="danger-button" onClick={onDelete} disabled={isSaving}>Eliminar usuario</button>
    </article>
  )
}

function DeleteUserDialog({ user, onCancel, onConfirm }: { user: AdminUser; onCancel: () => void; onConfirm: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function confirmDeletion() {
    try {
      setIsDeleting(true)
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-user-title" aria-describedby="delete-user-description">
        <h2 id="delete-user-title">Eliminar a {user.username}</h2>
        <p id="delete-user-description">Vas a eliminar la cuenta <strong>{user.email}</strong>. Sus sesiones y tokens asociados también se eliminarán. Esta acción no se puede deshacer.</p>
        <div className="dialog__actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={isDeleting}>Cancelar</button>
          <button type="button" className="danger-button" onClick={() => void confirmDeletion()} disabled={isDeleting}>{isDeleting ? 'Eliminando…' : 'Eliminar usuario'}</button>
        </div>
      </section>
    </div>
  )
}
