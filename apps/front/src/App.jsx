import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import PublicHome from './pages/PublicHome'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AuthenticatedHome from './pages/AuthenticatedHome'
import PlayersPage from './pages/PlayersPage'
import Header from './components/Header'
import ApiService from './services/api'

const App = () => {
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
        } catch (error) {
          localStorage.removeItem('authToken');
          console.error('Erro ao verificar autenticação:', error);
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleSignIn = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleSignUp = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null)
    setIsAuthenticated(false)
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
    <Router>
      {isAuthenticated && (
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          user={user}
        />
      )}
      <Routes>
        {/* Rotas públicas */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <PublicHome />
          } 
        />
        <Route 
          path="/signin" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn onSignIn={handleSignIn} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp onSignUp={handleSignUp} />
          } 
        />
        
        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <AuthenticatedHome user={user} /> : <Navigate to="/signin" replace />
          } 
        />
        <Route 
          path="/players" 
          element={
            isAuthenticated ? <PlayersPage /> : <Navigate to="/signin" replace />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
