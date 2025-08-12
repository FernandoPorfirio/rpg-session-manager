import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import PublicHome from './pages/PublicHome'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AuthenticatedHome from './pages/AuthenticatedHome'
import Header from './components/Header'
import ApiService from './services/api'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));

          const userProfile = await ApiService.getProfile(tokenPayload.id);

          setUser(userProfile);
          setIsAuthenticated(true);
          setCurrentPage('authenticated-home');
        } catch (error) {
          localStorage.removeItem('authToken');
          console.error('Erro ao verificar autenticação:', error);
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleSignIn = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setCurrentPage('authenticated-home')
  }

  const handleSignUp = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setCurrentPage('authenticated-home')
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null)
    setIsAuthenticated(false)
    setCurrentPage('home')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'signin':
        return (
          <SignIn
            onNavigate={handleNavigate}
            onSignIn={handleSignIn}
          />
        )
      case 'signup':
        return (
          <SignUp
            onNavigate={handleNavigate}
            onSignUp={handleSignUp}
          />
        )
      case 'authenticated-home':
        return (
          <AuthenticatedHome
            user={user}
            onLogout={handleLogout}
          />
        )
      default:
        return (
          <PublicHome
            onNavigate={handleNavigate}
          />
        )
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(180deg, #a3bb98 0%, #ffffff 100%)'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando...
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      {currentPage !== 'signin' && currentPage !== 'signup' && (
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          user={user}
        />
      )}
      {renderCurrentPage()}
    </div>
  )
}

export default App
