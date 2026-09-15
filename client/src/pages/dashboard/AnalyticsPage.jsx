import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import './crud.css'

function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function AnalyticsPage() {
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    supabase
      .from('conversations')
      .select('id, status, created_at')
      .then(({ data }) => setConversations(data ?? []))
  }, [])

  const days = lastNDays(7)
  const counts = days.map(
    (day) => conversations.filter((c) => c.created_at?.slice(0, 10) === day).length
  )
  const maxCount = Math.max(1, ...counts)

  const total = conversations.length
  const open = conversations.filter((c) => c.status === 'open').length
  const closed = conversations.filter((c) => c.status === 'closed').length

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Analytics</h1>
          <p className="dash-header__subtitle">How your team and AI agents are performing.</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card glass-border">
          <div className="stat-card__label">Total conversations</div>
          <div className="stat-card__value">{total}</div>
        </div>
        <div className="stat-card glass-border">
          <div className="stat-card__label">Open</div>
          <div className="stat-card__value">{open}</div>
        </div>
        <div className="stat-card glass-border">
          <div className="stat-card__label">Closed</div>
          <div className="stat-card__value">{closed}</div>
        </div>
      </div>

      <div className="chart-card glass-border">
        <h3 className="chart-card__title">Conversations — last 7 days</h3>
        <svg viewBox="0 0 350 140" width="100%" height="140" role="img" aria-label="Bar chart of conversations per day">
          {counts.map((c, i) => {
            const barWidth = 30
            const gap = 20
            const x = i * (barWidth + gap) + 10
            const height = (c / maxCount) * 100
            const y = 110 - height
            return (
              <g key={days[i]}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height || 2}
                  rx={4}
                  fill="var(--accent)"
                />
                <text x={x + barWidth / 2} y={128} fontSize="9" fill="var(--text-faint)" textAnchor="middle">
                  {days[i].slice(5)}
                </text>
                <text x={x + barWidth / 2} y={y - 4} fontSize="10" fill="var(--text-dim)" textAnchor="middle">
                  {c}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </>
  )
}
