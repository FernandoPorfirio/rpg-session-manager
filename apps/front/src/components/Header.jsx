const Header = ({ isAuthenticated, onLogout, onNavigate }) => {
  return (
    <header className="header">
      <div className="container">
        <nav>
          <div className="logo">RPG Session Manager</div>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <button className="btn btn-secondary">Minhas Sessões</button>
                <button onClick={onLogout} className="btn btn-secondary">Sair</button>
              </>
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
