import { useState, useEffect } from 'react'
import axios from 'axios'
import UsuariosCard from '../components/UsuariosCard'
import PedidosCard from '../components/PedidosCard'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import './Dashboard.css'
import InventarioCard from '../components/InventarioCard'

function Dashboard() {
  const [usuarios, setUsuarios] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [inventario, setInventario] = useState([])
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
      const [usuariosRes, pedidosRes, inventarioRes] = await Promise.all([
        axios.get(`${API_URL}/usuarios`),
        axios.get(`${API_URL}/pedidos`),
        axios.get(`${API_URL}/inventario`),
      ])

      setUsuarios(usuariosRes.data.data || [])
      setPedidos(pedidosRes.data.data || [])
      setInventario(inventarioRes.data.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }
  const handleReservar = async (itemId, cantidad) => {
    try{
      const response = await axios.post(`${API_URL}/inventario/reservar`, 
        { Id: itemId, Cantidad: cantidad })
      setInventario(prev => 
        prev.map(item =>
          item.id === itemId ? response.data.item : item
        )
      )
      alert("La reserva se realizo exitosamente");
      console.log('Reserva exitosa:', response.data);
    }catch(err){
      console.error('Error reservando item:', err)
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
  const totalProductos = inventario.length;
  const totalStock= inventario.reduce((sum, item) => sum + item.stock, 0);
  const productosAgotados = inventario.filter(item => item.stock ===0).length;

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
            title="Procuctos en Inventario"
            value={totalProductos}
            color="#8b5cf6"
          />
          <StatsCard
            title="Stock Total"
            value={totalStock}
            color="rgba(215, 106, 28, 1)"
          />
          <StatsCard
            title="Productos Agotados"
            value={productosAgotados}
            color={productosAgotados > 0 ? "#ef4444" : "#10b981"}
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
        {/* Inventario C# */}
        <div className="inventario-section">
          <InventarioCard inventario={inventario} onReservar={handleReservar} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
