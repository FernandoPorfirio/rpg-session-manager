import { Container, Paper, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
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
        background: 'linear-gradient(180deg, #a3bb98 0%, #ffffff 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
            Dashboard RPG Session Manager
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            Gerencie suas campanhas, personagens e sessões de RPG
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={handlePlayersClick}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                  Players
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gerencie seus jogadores, suas classes, levels e histórias
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Gerenciar Players
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AuthenticatedHome
