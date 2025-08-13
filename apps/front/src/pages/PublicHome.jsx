import { Container, Paper, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const PublicHome = () => {
  const navigate = useNavigate()

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #a3bb98 0%, #ffffff 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" component="p" gutterBottom>
            Organize suas sessões de RPG de forma simples
          </Typography>
        </Box>

        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Bem-vindo!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Gerencie suas sessões de RPG, organize guilds e acompanhe seu progresso.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{ minWidth: 120 }}
            >
              Entrar
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ minWidth: 120 }}
            >
              Criar Conta
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PublicHome
