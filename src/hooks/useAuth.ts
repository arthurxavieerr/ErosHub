import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginCredentials {
  email?: string
  username?: string
  password: string
}

interface User {
  email: string
  username: string
  password: string
  userInfo: {
    loginName: string
    locale: string
    timezone: string
    lastLogin: string
  }
}

export function useAuth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError('')

      // Recupera usuários do localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

      // Procura o usuário pelo email OU username
      const user = users.find(u => {
        if (credentials.email) {
          return u.email.toLowerCase() === credentials.email.toLowerCase() && 
                 u.password === credentials.password
        } else if (credentials.username) {
          return u.username.toLowerCase() === credentials.username.toLowerCase() && 
                 u.password === credentials.password
        }
        return false
      })

      if (!user) {
        throw new Error('Usuário ou senha inválidos')
      }

      // Atualiza as informações do usuário mantendo o username original
      const updatedUser = {
        ...user,
        userInfo: {
          loginName: user.username, // Usa o username original do usuário
          locale: 'pt-BR',
          timezone: 'UTC',
          lastLogin: new Date().toISOString()
        }
      }

      // Salva o usuário logado
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      // Redireciona para o dashboard
      navigate('/dashboard')

    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('currentUser')
      navigate('/')
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err)
    }
  }

  return { login, logout, loading, error }
}