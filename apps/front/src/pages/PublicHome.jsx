const PublicHome = ({ onNavigate }) => {
  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="text-center mb-2">
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
              Organize suas sessões de RPG de forma simples
            </p>
          </div>

          <div className="card text-center">
            <h2 className="card-title">Bem-vindo!</h2>
            <p className="mb-2">
              Gerencie suas sessões de RPG, organize guilds e acompanhe seu progresso.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('signin')}
                className="btn btn-primary"
              >
                Entrar
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="btn btn-secondary"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PublicHome
