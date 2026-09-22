import type { User } from '../types/user'

const API_URL = 'http://localhost:3005/api'

// Centraliza las peticiones y convierte los errores de la API en mensajes simples.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options)
  const data = (await response.json().catch(() => ({}))) as {
    error?: string
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? 'Ocurrió un error en la petición.')
  }

  return data as T
}

export async function register(username: string, email: string, password: string) {
  return request<User>('/personas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
}

export async function login(identifier: string, password: string) {
  await request<{ success: true }>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  })

  // El endpoint de login no devuelve el usuario. Lo buscamos solo después de autenticarlo.
  const field = identifier.includes('@') ? 'email' : 'username'
  return request<User>(`/personas/${field}/${encodeURIComponent(identifier)}`)
}
