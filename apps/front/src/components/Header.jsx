import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Header = ({ isAuthenticated, onLogout, user }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'rgba(163, 187, 152, 0.9)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ flexGrow: 1, color: 'text.primary', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          RPG Session Manager {user?.name ? ` - GM ${user.name}!` : ""}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
                sx={{ color: 'text.primary', borderColor: 'text.primary' }}
              >
                Entrar
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/signup')}
                sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
