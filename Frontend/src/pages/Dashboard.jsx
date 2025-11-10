import { useState, useEffect } from 'react'
import axios from 'axios'
import UsuariosCard from '../components/UsuariosCard'
import PedidosCard from '../components/PedidosCard'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import './Dashboard.css'

function Dashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // URL del API Gateway
  // En Docker Compose: http://localhost:8080/api
  // En Kubernetes: http://localhost:30080/api
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Llamadas paralelas al API Gateway
      const [usuariosRes, pedidosRes] = await Promise.all([
        axios.get(`${API_URL}/usuarios`),
        axios.get(`${API_URL}/pedidos`)
      ])

      setUsuarios(usuariosRes.data.data || [])
      setPedidos(pedidosRes.data.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="dashboard">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos del API Gateway...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <Header />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error al cargar datos</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Header onRefresh={handleRefresh} />
      
      <div className="dashboard-content">
        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          <StatsCard
            title="Total Usuarios"
            value={usuarios.length}
            icon="👥"
            color="#3b82f6"
          />
          <StatsCard
            title="Total Pedidos"
            value={pedidos.length}
            icon="📦"
            color="#10b981"
          />
          <StatsCard
            title="Último Pedido"
            value={pedidos.length > 0 ? new Date(pedidos[0].fecha).toLocaleDateString() : 'N/A'}
            icon="📅"
            color="#f59e0b"
          />
          <StatsCard
            title="Estado Gateway"
            value="Activo"
            icon="✅"
            color="#10b981"
          />
        </div>

        {/* Grid de contenido principal */}
        <div className="content-grid">
          <UsuariosCard usuarios={usuarios} />
          <PedidosCard pedidos={pedidos} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
