import './UsuariosCard.css'

function UsuariosCard({ usuarios }) {
  return (
    <div className="data-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">👥</span>
          Usuarios Registrados
        </h2>
        <span className="card-badge">{usuarios.length} usuarios</span>
      </div>
      
      <div className="card-content">
        {usuarios.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="id-badge">{usuario.id}</span>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className="email">{usuario.correo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsuariosCard
