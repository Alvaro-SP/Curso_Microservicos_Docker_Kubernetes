import { useState } from 'react'
import './InventarioCard.css'

function InventarioCard({ inventario, onReservar, onReabastecer }) {
  const [reservando, setReservando] = useState(null)
  const [reabasteciendo, setReabasteciendo] = useState(null)

  // Formatear precio a moneda
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio)
  }

  // Obtener color según nivel de stock
  const getStockColor = (stock) => {
    if (stock === 0) return 'stock-out'
    if (stock < 5) return 'stock-low'
    if (stock < 10) return 'stock-medium'
    return 'stock-good'
  }

  const handleReservar = async (item) => {
    setReservando(item.id)
    try {
      await onReservar(item.id, 1)
    } finally {
      setReservando(null)
    }
  }

  const handleReabastecer = async (item) => {
    setReabasteciendo(item.id)
    try {
      await onReabastecer(item.id, 5)
    } finally {
      setReabasteciendo(null)
    }
  }

  return (
    <div className="data-card inventario-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📦</span>
          Inventario
        </h2>
        <span className="card-badge">{inventario.length} productos</span>
      </div>
      
      <div className="card-content">
        {inventario.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No hay productos en el inventario</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table inventario-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="id-badge">{item.id}</span>
                    </td>
                    <td>
                      <div className="product-info">
                        <span className="product-icon">🛠️</span>
                        <span className="product-name">{item.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-badge ${getStockColor(item.stock)}`}>
                        {item.stock === 0 ? '❌ Agotado' : `${item.stock} unidades`}
                      </span>
                    </td>
                    <td>
                      <span className="precio">{formatPrecio(item.precio)}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-reservar"
                          onClick={() => handleReservar(item)}
                          disabled={item.stock === 0 || reservando === item.id}
                          title="Reservar 1 unidad"
                        >
                          {reservando === item.id ? '⏳' : '📤 Reservar'}
                        </button>
                        <button
                          className="btn-reabastecer"
                          onClick={() => handleReabastecer(item)}
                          disabled={reabasteciendo === item.id}
                          title="Reabastecer 5 unidades"
                        >
                          {reabasteciendo === item.id ? '⏳' : '📥 +5'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color stock-good"></span>
            <span>Stock alto (≥10)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color stock-medium"></span>
            <span>Stock medio (5-9)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color stock-low"></span>
            <span>Stock bajo (1-4)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color stock-out"></span>
            <span>Agotado</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventarioCard
