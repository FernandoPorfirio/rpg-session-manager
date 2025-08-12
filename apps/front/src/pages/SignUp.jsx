import { useState } from 'react'
import ApiService from '../services/api'

const SignUp = ({ onNavigate, onSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Por favor, preencha todos os campos'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem'
    }

    if (formData.password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const gameMaster = await ApiService.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const loginResponse = await ApiService.signIn({
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('authToken', loginResponse.token);

      onSignUp({
        id: gameMaster.id,
        name: gameMaster.name,
        email: gameMaster.email
      });

    } catch (error) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="form-container">
            <h1 className="text-center mb-2">Criar Conta</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="text-error mb-1">{error}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full mb-1"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <div className="text-center">
              <p>
                Já tem uma conta?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  style={{ background: 'none', border: 'none', color: '#a3bb98', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Faça login
                </button>
              </p>
              <p className="mt-1">
                <button
                  onClick={() => onNavigate('home')}
                  style={{ background: 'none', border: 'none', color: '#a3bb98', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Voltar ao início
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUp
