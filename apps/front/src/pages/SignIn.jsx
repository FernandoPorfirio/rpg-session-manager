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
  Stack
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import MedievalLoader from '../components/MedievalLoader'
import FormAlert from '../components/ui/FormAlert'
import useFormValidation from '../hooks/useFormValidation'
import ApiService from '../services/api'

// Regras de validação para login
const signInValidationRules = {
  email: {
    required: true,
    requiredMessage: 'Email é obrigatório',
    email: true,
    emailMessage: 'Email deve ter um formato válido'
  },
  password: {
    required: true,
    requiredMessage: 'Senha é obrigatória'
  }
};

const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const {
    isFormValid,
    getFieldError,
    validateSingleField,
    touchField,
    clearErrors
  } = useFormValidation(signInValidationRules)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Limpa erro específico quando usuário começa a digitar
    if (error) {
      setError('')
      setShowAlert(false)
    }
  }

  const handleBlur = (fieldName) => {
    touchField(fieldName)
    validateSingleField(fieldName, formData[fieldName])
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2F4F4F' }}>
              🏰 Entrada da Taverna
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontStyle: 'italic',
              fontSize: '1.1rem'
            }}>
              "Mostre suas credenciais, aventureiro"
            </Typography>
          </Box>

          <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email do Mestre"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-input': {
                  py: 2,
                  fontSize: '1.1rem'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem'
                }
              }}
            />

            <TextField
              fullWidth
              label="Palavra Secreta"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-input': {
                  py: 2,
                  fontSize: '1.1rem'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem'
                }
              }}
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                minHeight: '48px'
              }}
            >
              {loading ? <MedievalLoader size={24} /> : '⚔️ Entrar na Aventura'}
            </Button>
          </Stack>

          <Box textAlign="center" sx={{
            pt: 4,
            borderTop: '1px solid rgba(139, 69, 19, 0.2)',
            mt: 4
          }}>
            <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
              Novo nas terras raras?{' '}
              <Link
                component="button"
                onClick={() => navigate('/signup')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Pedir Alojamento
              </Link>
            </Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              <Link
                component="button"
                onClick={() => navigate('/')}
                sx={{
                  cursor: 'pointer',
                  color: '#696969',
                  fontSize: '1rem'
                }}
              >
                Retornar ao Acampamento
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignIn
