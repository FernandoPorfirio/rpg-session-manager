import { useState } from 'react'
import PublicHome from './pages/PublicHome'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AuthenticatedHome from './pages/AuthenticatedHome'
import Header from './components/Header'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  return (
    <div>
      {currentPage !== 'signin' && currentPage !== 'signup' && (
        <Header 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {renderCurrentPage()}
    </div>
  )
}

export default App
