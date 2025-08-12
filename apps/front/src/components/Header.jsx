const Header = ({ isAuthenticated, onLogout, onNavigate, user }) => {
  return (
    <header className="header">
      <div className="container">
        <nav>
          <div className="logo">RPG Session Manager {user?.name ? ` - GM ${user.name}!` : ""}</div>
          <div className="nav-links">
            {isAuthenticated ? (
              <button onClick={onLogout} className="btn btn-secondary">Sair</button>
            ) : (
              <>
                <button onClick={() => onNavigate('signin')} className="btn btn-secondary">Entrar</button>
                <button onClick={() => onNavigate('signup')} className="btn btn-primary">Cadastrar</button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
