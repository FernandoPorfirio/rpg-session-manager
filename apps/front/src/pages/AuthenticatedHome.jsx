import { Container, Paper, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { Person as PersonIcon, Shield as ShieldIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const AuthenticatedHome = () => {
  const navigate = useNavigate()

  const handlePlayersClick = () => {
    navigate('/players')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper sx={{
          p: 5,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(245, 245, 220, 0.85) 100%)',
          border: '2px solid rgba(139, 69, 19, 0.3)',
          borderRadius: '16px',
        }}>
          <Typography variant="h2" component="h1" sx={{ mb: 2, color: '#2F4F4F' }}>
            ⚔️ Salão do Mestre
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{
            mb: 2,
            fontSize: '1.5rem'
          }}>
            Bem-vindo ao seu reino de aventuras épicas
          </Typography>
          <Typography variant="body1" sx={{
            fontStyle: 'italic',
            color: '#696969',
            fontSize: '1.1rem'
          }}>
            "Um verdadeiro mestre cria mundos onde as lendas nascem"
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.9) 0%, rgba(245, 245, 220, 0.8) 100%)',
                border: '2px solid rgba(139, 69, 19, 0.3)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 12px 40px rgba(47, 79, 79, 0.3), 0 0 30px rgba(184, 134, 11, 0.2)',
                  border: '2px solid rgba(184, 134, 11, 0.5)',
                }
              }}
              onClick={handlePlayersClick}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#2F4F4F' }}>
                  Aventureiros
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}>
                  Gerencie seus valentes heróis, suas classes místicas, níveis épicos e histórias lendárias
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    minHeight: '48px'
                  }}
                  fullWidth
                >
                  Gerenciar Heróis
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.7) 0%, rgba(245, 245, 220, 0.6) 100%)',
                border: '2px dashed rgba(139, 69, 19, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" sx={{
                  color: '#696969',
                  mb: 2,
                  fontSize: '1.3rem'
                }}>
                  🏰 Em Construção
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#888',
                  fontStyle: 'italic',
                  fontSize: '1rem'
                }}>
                  Novas funcionalidades chegando em breve...
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.7) 0%, rgba(245, 245, 220, 0.6) 100%)',
                border: '2px dashed rgba(139, 69, 19, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" sx={{
                  color: '#696969',
                  mb: 2,
                  fontSize: '1.3rem'
                }}>
                  🗡️ Em Construção
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#888',
                  fontStyle: 'italic',
                  fontSize: '1rem'
                }}>
                  Mais aventuras por vir...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AuthenticatedHome
