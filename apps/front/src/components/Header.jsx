import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Header = ({ isAuthenticated, onLogout, user }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          sx={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            color: '#F5DEB3',
            fontSize: '2rem',
            textTransform: 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            '&:hover': {
              color: '#B8860B',
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          🏰 RPG Session Manager {user?.name ? `- Mestre ${user.name} 🧙‍♂️` : ""}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{ color: 'text.primary', borderColor: 'text.primary' }}
            >
              Sair
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate('/signin')}
                sx={{
                  color: '#F5DEB3',
                  borderColor: '#F5DEB3',
                  '&:hover': {
                    borderColor: '#B8860B',
                    color: '#B8860B',
                    background: 'rgba(184, 134, 11, 0.1)'
                  }
                }}
              >
                🏰 Entrar
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: '#B8860B',
                  color: '#2F4F4F',
                  '&:hover': {
                    bgcolor: '#DAA520',
                  }
                }}
              >
                📜 Criar Lenda
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
