import { Container, Paper, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const PublicHome = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F5DC 0%, rgba(245, 245, 220, 0.9) 50%, #F5F5DC 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(184, 134, 11, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%)
        `,
        py: 4
      }}
    >
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            color: '#2F4F4F',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mb: 2
          }}>
            🐉 RPG Session Manager 🗡️
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{
            color: '#696969',
            fontStyle: 'italic',
          }}>
            Organize suas sessões de RPG de forma épica
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(245, 245, 220, 0.85) 100%)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(139, 69, 19, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(47, 79, 79, 0.2)',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            ⚔️ Bem-vindo, Aventureiro! ⚔️
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem', lineHeight: 1.6 }}>
            Gerencie suas campanhas épicas, organize guildas lendárias e acompanhe o progresso
            de seus heróis através de aventuras inesquecíveis.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{ minWidth: 140, py: 1.5 }}
            >
              🏰 Entrar na Taverna
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ minWidth: 140, py: 1.5 }}
            >
              📜 Pedir Alojamento
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(139, 69, 19, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#696969', fontStyle: 'italic' }}>
              "Toda grande aventura começa com um primeiro passo..."
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PublicHome
