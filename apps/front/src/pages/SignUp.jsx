import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link
} from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import MedievalLoader from '../components/MedievalLoader'
import ApiService from '../services/api'

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate()
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

      navigate('/dashboard');

    } catch (error) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            border: '2px solid rgba(139, 69, 19, 0.3)',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              📜 Registro de Mestre
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "Toda lenda tem um começo. Comece a sua agora..."
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="👑 Nome do Mestre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="📧 Email Místico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="🔐 Palavra Secreta"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="🔒 Confirmar Palavra Secreta"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, mb: 3, py: 2 }}
            >
              {loading ? <MedievalLoader size={24} /> : '🌟 Iniciar Jornada'}
            </Button>
          </Box>

          <Box textAlign="center" sx={{
            pt: 3,
            borderTop: '1px solid rgba(139, 69, 19, 0.2)'
          }}>
            <Typography sx={{ mb: 1 }}>
              Já possui suas credenciais?{' '}
              <Link
                component="button"
                onClick={() => navigate('/signin')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                🏰 Entrar na Taverna
              </Link>
            </Typography>
            <Typography>
              <Link
                component="button"
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer', color: '#696969' }}
              >
                🏕️ Retornar ao Acampamento
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignUp
