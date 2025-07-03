import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      // Aqui você implementará a lógica de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulando delay
      setSuccessMessage('E-mail de recuperação enviado com sucesso!')
    } catch (err) {
      setError('Erro ao enviar e-mail de recuperação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='Container'>
      <div className='ForgotPasswordForm'>
        <div className='Logo_Container'>
          <div className='Logo'></div>
        </div>
        <div className='FormContainer'>
          <div className='FormTitle_container'>
            <div className='Title'>
              <h2 className='MainTitle'>Recuperar Senha</h2>
              <p className='SubTitle'>
                Digite seu e-mail para receber as instruções de recuperação
              </p>
            </div>
            
            <div className='Title'>
              <p className='FormTitle'>E-mail</p>
            </div>
            <div className='Input_container'>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail" 
                className="email_placeholder"
              />
            </div>

            {error && (
              <div className='Error_container'>
                <p className='ErrorText'>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className='Success_container'>
                <p className='SuccessText'>{successMessage}</p>
              </div>
            )}

            <div className='Button_container'>
              <button 
                className='RecuperarButton' 
                onClick={handleSubmit}
                disabled={loading || !email}
              >
                {loading ? 'Enviando...' : 'Enviar E-mail'}
              </button>
            </div>

            <div className='Back_container'>
              <p className='BackText'>
                Lembrou sua senha?{' '}
                <span 
                  onClick={() => navigate('/')} 
                  className='BackLink'
                  style={{ cursor: 'pointer' }}
                >
                  Voltar para login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword