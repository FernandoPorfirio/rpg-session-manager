import { useState } from 'react'
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
            Entrar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
          </Box>

          <Box textAlign="center">
            <Typography>
              Não tem uma conta?{' '}
              <Link
                component="button"
                onClick={() => onNavigate('signup')}
                sx={{ cursor: 'pointer' }}
              >
                Cadastre-se
              </Link>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <Link
                component="button"
                onClick={() => onNavigate('home')}
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

export default SignIn
