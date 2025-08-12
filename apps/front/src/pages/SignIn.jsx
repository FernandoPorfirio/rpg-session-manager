import { useState } from 'react'
import ApiService from '../services/api'

const SignIn = ({ onNavigate, onSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await ApiService.signIn({
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('authToken', response.token);

      const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));

      onSignIn({
        id: tokenPayload.id,
        email: tokenPayload.email
      });

    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="form-container">
            <h1 className="text-center mb-2">Entrar</h1>

            <form onSubmit={handleSubmit}>
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

              {error && (
                <div className="text-error mb-1">{error}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full mb-1"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="text-center">
              <p>
                Não tem uma conta?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  style={{ background: 'none', border: 'none', color: '#a3bb98', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Cadastre-se
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

export default SignIn
