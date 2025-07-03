import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

interface UserInfo {
  loginName: string;
  locale: string;
  timezone: string;
  lastLogin: string;
}

interface User {
  email: string;
  username: string;
  password: string;
  createdAt: string;
  userInfo: UserInfo;
}

const Register: React.FC = () => {  // Corrigido aqui: definido como React.FC
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Informações do usuário atual
  const currentUserInfo: UserInfo = {
    loginName: 'arthurxavieerr',
    locale: 'pt-BR',
    timezone: 'UTC',
    lastLogin: '2025-07-03 02:30:56'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      // Validações básicas
      if (!formData.email || !formData.username || !formData.password) {
        throw new Error('Por favor, preencha todos os campos')
      }

      const email = formData.email.trim()
      const username = formData.username.trim()
      const password = formData.password.trim()
      const confirmPassword = formData.confirmPassword.trim()

      if (!email || !username || !password || !confirmPassword) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não conferem!')
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres!')
      }

      if (username.length < 3) {
        throw new Error('O nome de usuário deve ter pelo menos 3 caracteres!')
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um e-mail válido')
      }

      // Validar caracteres permitidos no username
      const usernameRegex = /^[a-zA-Z0-9_]+$/
      if (!usernameRegex.test(username)) {
        throw new Error('Nome de usuário pode conter apenas letras, números e _')
      }

      // Recupera usuários existentes
      let existingUsers: User[] = []
      const savedUsers = localStorage.getItem('users')
      
      if (savedUsers) {
        try {
          existingUsers = JSON.parse(savedUsers)
          if (!Array.isArray(existingUsers)) {
            throw new Error('Formato inválido')
          }
        } catch (parseError) {
          console.error('Erro ao ler usuários:', parseError)
          localStorage.setItem('users', '[]')
          existingUsers = []
        }
      }

      // Verifica username duplicado
      if (existingUsers.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Este nome de usuário já está em uso!')
      }

      // Verifica email duplicado
      if (existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Este e-mail já está cadastrado!')
      }

      // Cria novo usuário
      const newUser: User = {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
        userInfo: currentUserInfo
      }

      // Adiciona ao array e salva
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))

      // Limpa o formulário
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      })

      alert('Cadastro realizado com sucesso!')
      navigate('/')
      
    } catch (err: any) {
      console.error('Erro detalhado:', err)
      setError(err.message || 'Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClearStorage = () => {
    localStorage.clear()
    localStorage.setItem('users', '[]')
    alert('LocalStorage foi limpo!')
  }

  return (
    <div className="register-container">
      <div className="register-box max-w-md w-full m-4 p-8 rounded-xl">
        <button
          onClick={handleClearStorage}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Limpar LocalStorage
        </button>

        <div className="text-center mb-8">
          <h2 className="Title-create">Criar Conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados para se cadastrar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="Title-email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="register-input w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              placeholder="seu@email.com"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="Title-username">
              Nome de Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="register-input w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              placeholder="Seu nome de usuário"
              pattern="[a-zA-Z0-9_]+"
              title="Use apenas letras, números e _"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="Title-password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="register-input w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              placeholder="Sua senha"
              minLength={6}
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="Title-confirm-password">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="register-input w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              placeholder="Confirme sua senha"
              minLength={6}
            />
          </div>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            className="Button-submitt"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        {/* Link para Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <span 
              onClick={() => navigate('/')} 
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Faça login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register