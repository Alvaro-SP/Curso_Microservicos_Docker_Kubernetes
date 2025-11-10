import './PedidosCard.css'

function PedidosCard({ pedidos }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="data-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📦</span>
          Pedidos Generados
        </h2>
        <span className="card-badge">{pedidos.length} pedidos</span>
      </div>
      
      <div className="card-content">
        {pedidos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <p>No hay pedidos generados</p>
          </div>
        ) : (
          <div className="pedidos-list">
            {pedidos.map((pedido) => (
              <div key={pedido.pedido_id} className="pedido-item">
                <div className="pedido-icon">📦</div>
                <div className="pedido-info">
                  <div className="pedido-header-row">
                    <span className="pedido-id">Pedido #{pedido.pedido_id}</span>
                    <span className="pedido-status">Activo</span>
                  </div>
                  <div className="pedido-details">
                    <span className="pedido-user">
                      👤 {pedido.usuario}
                    </span>
                    <span className="pedido-date">
                      📅 {formatDate(pedido.fecha)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PedidosCard
