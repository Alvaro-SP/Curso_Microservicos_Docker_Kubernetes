import './StatsCard.css'

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="stats-card" style={{ '--card-color': color }}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-info">
        <p className="stats-title">{title}</p>
        <h3 className="stats-value">{value}</h3>
      </div>
    </div>
  )
}

export default StatsCard
