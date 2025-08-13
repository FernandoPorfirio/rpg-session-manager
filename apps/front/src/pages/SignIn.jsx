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
import { Login as LoginIcon } from '@mui/icons-material'
import MedievalLoader from '../components/MedievalLoader'
import ApiService from '../services/api'

const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate()
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

      navigate('/dashboard');

    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
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
              🏰 Entrada da Taverna
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              "Mostre suas credenciais, aventureiro"
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="📧 Email do Mestre"
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
              {loading ? <MedievalLoader size={24} /> : '⚔️ Entrar na Aventura'}
            </Button>
          </Box>

          <Box textAlign="center" sx={{
            pt: 3,
            borderTop: '1px solid rgba(139, 69, 19, 0.2)'
          }}>
            <Typography sx={{ mb: 1 }}>
              Novo nas terras raras?{' '}
              <Link
                component="button"
                onClick={() => navigate('/signup')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                📜 Pedir Alojamento
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

export default SignIn
