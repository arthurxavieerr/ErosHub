import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    userInput: '', // Pode ser email ou username
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verifica se o input é um email ou username
    const isEmail = formData.userInput.includes('@')
    
    // Cria o objeto com o campo apropriado
    const loginData = {
      [isEmail ? 'email' : 'username']: formData.userInput,
      password: formData.password
    }

    await login(loginData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className='Container'>
      <div className='LoginForm'>
        <div className='Logo_Container'>
          <div className='Logo'></div>
        </div>
        <div className='FormContainer'>
          <div className='FormTitle_container'>
            <div className='Title'>
              <p className='FormTitle'>Usuário ou E-mail</p>
            </div>
            <div className='Input_container'>
              <input 
                type="text" 
                name="userInput"
                value={formData.userInput}
                onChange={handleChange}
                placeholder="Digite seu usuário ou e-mail" 
                className="usuario_placeholder"
              />
            </div>
            <div className='Title'>
              <p className='FormTitle'>Senha</p>
            </div>
            <div className='Input_container'>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua Senha" 
                className="password_placeholder"
              />
            </div>
            <div className='Checkbox_container'>
              <input 
                type="checkbox" 
                className="remember_me_checkbox"
              />
              <p>Lembrar de mim?</p>
            </div>
            {error && (
              <div className='Error_container'>
                <p className='ErrorText'>{error}</p>
              </div>
            )}
            <div className='Button_container'>
              <button 
                className='LoginButton' 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Entrar'}
              </button>
            </div>
            <div className='Register_container'>
              <p className='RegisterText'>
                Não tem uma conta?{' '}
                <span 
                  onClick={() => navigate('/register')} 
                  className='RegisterLink'
                  style={{ cursor: 'pointer' }}
                >
                  Registrar
                </span>
              </p>
            </div>
            <div className='Esqueceu_container'>
              <p className='EsqueceuText'>
                Esqueceu sua senha?{' '}
                <span 
                  onClick={() => navigate('/forgot-password')} 
                  className='EsqueceuLink'
                  style={{ cursor: 'pointer' }}
                >
                  Clique aqui
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login