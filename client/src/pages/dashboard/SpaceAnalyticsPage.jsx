import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const STATUS_COLORS = { open: '#22c55e', pending: '#f59e0b', closed: 'var(--text-faint)' }

export default function SpaceAnalyticsPage() {
  const { id: widgetId } = useParams()
  const [conversations, setConversations] = useState([])
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    supabase
      .from('conversations')
      .select('id, status, created_at')
      .eq('widget_id', widgetId)
      .then(({ data }) => setConversations(data ?? []))

    supabase
      .from('messages')
      .select('id, conversation_id, conversations!inner(widget_id)', { count: 'exact', head: true })
      .eq('conversations.widget_id', widgetId)
      .then(({ count }) => setMessageCount(count ?? 0))
  }, [widgetId])

  const days = lastNDays(7)
  const counts = days.map(
    (day) => conversations.filter((c) => c.created_at?.slice(0, 10) === day).length
  )
  const maxCount = Math.max(1, ...counts)

  const total = conversations.length
  const statusCounts = {
    open: conversations.filter((c) => c.status === 'open').length,
    pending: conversations.filter((c) => c.status === 'pending').length,
    closed: conversations.filter((c) => c.status === 'closed').length,
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Analytics</h1>
          <p className="dash-header__subtitle">How this widget is performing.</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card glass-border">
          <div className="stat-card__label">Total conversations</div>
          <div className="stat-card__value">{total}</div>
        </div>
        <div className="stat-card glass-border">
          <div className="stat-card__label">Messages exchanged</div>
          <div className="stat-card__value">{messageCount}</div>
        </div>
        <div className="stat-card glass-border">
          <div className="stat-card__label">Open right now</div>
          <div className="stat-card__value">{statusCounts.open}</div>
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
                <rect x={x} y={y} width={barWidth} height={height || 2} rx={4} fill="var(--accent)" />
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

      <div className="chart-card glass-border">
        <h3 className="chart-card__title">Status breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  color: 'var(--text-dim)',
                  marginBottom: 6,
                  textTransform: 'capitalize',
                }}
              >
                <span>{status}</span>
                <span>{count}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    width: `${total ? (count / total) * 100 : 0}%`,
                    background: STATUS_COLORS[status],
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
