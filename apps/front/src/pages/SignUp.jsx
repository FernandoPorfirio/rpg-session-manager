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
  Link,
  CircularProgress
} from '@mui/material'
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
        background: 'linear-gradient(180deg, #a3bb98 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Criar Conta
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
            </Button>
          </Box>

          <Box textAlign="center">
            <Typography>
              Já tem uma conta?{' '}
              <Link
                component="button"
                onClick={() => navigate('/signin')}
                sx={{ cursor: 'pointer' }}
              >
                Faça login
              </Link>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <Link
                component="button"
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer' }}
              >
                Voltar ao início
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignUp
