import './Header.css'

function Header({ onRefresh }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-icon">📊</span>
            Dashboard actualizado de Microservicios
          </h1>
          <p className="header-subtitle">API Gateway - Usuarios y Pedidos</p>
        </div>
        <div className="header-right">
          {onRefresh && (
            <button onClick={onRefresh} className="refresh-button" title="Actualizar datos">
              🔄 Actualizar
            </button>
          )}
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>En vivo</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
