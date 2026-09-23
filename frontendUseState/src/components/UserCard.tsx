import { useState } from 'react'
import type { User } from '../types/user'
import { getPasswordError, getUsernameError } from '../utils/password'
import { readProfilePicture } from '../utils/profilePicture'
import { PasswordField } from './PasswordField'

type UserCardProps = {
  user: User
  onLogout: () => Promise<void>
  onUpdateUsername: (username: string) => Promise<User>
  onUpdateProfilePicture: (profilePicture: string) => Promise<User>
  onChangePassword: (currentPassword: string, password: string) => Promise<void>
  onOpenAdmin: () => void
  onDeleteAccount: () => Promise<void>
}

export function UserCard({ user, onLogout, onUpdateUsername, onUpdateProfilePicture, onChangePassword, onOpenAdmin, onDeleteAccount }: UserCardProps) {
  const [username, setUsername] = useState(user.username)
  const [picture, setPicture] = useState<string | null>(user.profile_picture)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  function resetFeedback() {
    setMessage('')
    setError('')
  }

  async function saveUsername(event: React.FormEvent) {
    event.preventDefault()
    const validationError = getUsernameError(username)
    if (validationError) return setError(validationError)
    try {
      resetFeedback()
      setIsSaving(true)
      const updated = await onUpdateUsername(username.trim())
      setUsername(updated.username)
      setMessage('Nombre de usuario actualizado.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo actualizar el nombre.')
    } finally {
      setIsSaving(false)
    }
  }

  async function selectPicture(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      resetFeedback()
      setPicture(await readProfilePicture(event.target.files?.[0]))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cargar la imagen.')
    }
  }

  async function savePicture() {
    if (!picture) return setError('Selecciona una imagen antes de guardar.')
    try {
      resetFeedback()
      setIsSaving(true)
      const updated = await onUpdateProfilePicture(picture)
      setPicture(updated.profile_picture)
      setMessage('Foto de perfil actualizada.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo actualizar la foto.')
    } finally {
      setIsSaving(false)
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault()
    const validationError = getPasswordError(newPassword)
    if (validationError) return setError(validationError)
    try {
      resetFeedback()
      setIsSaving(true)
      await onChangePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setMessage('Contraseña actualizada. Las otras sesiones se cerraron.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo actualizar la contraseña.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteAccount() {
    try {
      setIsDeletingAccount(true)
      await onDeleteAccount()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo eliminar la cuenta.')
      setIsDeletingAccount(false)
    }
  }

  return (
    <section className="user-card account-card" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Mi cuenta</h1>
      <div className="profile-summary">
        {picture ? <img src={picture} alt="Foto de perfil" className="profile-picture" /> : <span className="profile-picture profile-picture--placeholder" aria-hidden="true">{user.username.slice(0, 1).toUpperCase()}</span>}
        <div><p><strong>Usuario:</strong> {user.username}</p><p><strong>Email:</strong> {user.email}</p></div>
      </div>
      {message && <p className="message" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <form className="form settings-form settings-form--identity" onSubmit={saveUsername}>
        <h2>Nombre de usuario</h2>
        <label className="field">Nuevo nombre de usuario<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>
        <button disabled={isSaving}>Guardar nombre</button>
      </form>
      <div className="form settings-form settings-form--picture">
        <h2>Foto de perfil</h2>
        <label className="field">Imagen (PNG, JPG, WEBP o GIF; máx. 1.5 MB)<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectPicture} /></label>
        <button type="button" onClick={savePicture} disabled={isSaving || !picture}>Guardar foto</button>
      </div>
      <form className="form settings-form settings-form--password" onSubmit={savePassword}>
        <h2>Cambiar contraseña</h2>
        <PasswordField label="Contraseña actual" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
        <PasswordField label="Nueva contraseña" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
        <p className="form-hint">Mínimo 8 caracteres, con letras y números.</p>
        <button disabled={isSaving}>Cambiar contraseña</button>
      </form>
      <div className="account-actions">
        {user.role === 'admin' && <button type="button" className="secondary-button" onClick={onOpenAdmin}>Administrar usuarios</button>}
        <button type="button" onClick={onLogout}>Cerrar sesión</button>
        <button type="button" className="danger-button" onClick={() => setIsDeleteDialogOpen(true)}>Eliminar mi cuenta</button>
      </div>
      {isDeleteDialogOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description">
            <h2 id="delete-account-title">Eliminar mi cuenta</h2>
            <p id="delete-account-description">Vas a eliminar permanentemente tu cuenta local <strong>{user.email}</strong>. Esta acción no se puede deshacer.</p>
            <div className="dialog__actions">
              <button type="button" className="secondary-button" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingAccount}>Cancelar</button>
              <button type="button" className="danger-button" onClick={() => void deleteAccount()} disabled={isDeletingAccount}>{isDeletingAccount ? 'Eliminando…' : 'Eliminar mi cuenta'}</button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
