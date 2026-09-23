// Representa los datos públicos que devuelve la API. Nunca contiene contraseñas.
export type User = {
  username: string
  email: string
  email_verified_at: string | null
  profile_picture: string | null
  role: 'user' | 'admin'
}

// El id solo llega al panel de administración; nunca se muestra en una cuenta normal.
export type AdminUser = User & {
  id: number
}
