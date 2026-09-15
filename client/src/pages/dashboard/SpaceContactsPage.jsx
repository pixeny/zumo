import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import './crud.css'

export default function SpaceContactsPage() {
  const { id: widgetId } = useParams()
  const [visitors, setVisitors] = useState([])

  useEffect(() => {
    load()
  }, [widgetId])

  async function load() {
    const { data } = await supabase
      .from('conversations')
      .select('id, customer_id, status, created_at')
      .eq('widget_id', widgetId)
      .order('created_at', { ascending: true })

    const byVisitor = new Map()
    for (const c of data ?? []) {
      if (!c.customer_id) continue
      const existing = byVisitor.get(c.customer_id)
      if (existing) {
        existing.conversationCount += 1
        existing.lastSeen = c.created_at
        if (c.status === 'open' || c.status === 'pending') existing.hasOpen = true
      } else {
        byVisitor.set(c.customer_id, {
          id: c.customer_id,
          firstSeen: c.created_at,
          lastSeen: c.created_at,
          conversationCount: 1,
          hasOpen: c.status === 'open' || c.status === 'pending',
        })
      }
    }
    setVisitors(Array.from(byVisitor.values()).sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1)))
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Contacts</h1>
          <p className="dash-header__subtitle">
            Everyone who has talked to this widget, derived from their conversations.
          </p>
        </div>
      </div>

      <div className="crud-table-wrap glass-border">
        {visitors.length === 0 ? (
          <p className="crud-empty">No visitors yet — once someone chats, they'll show up here.</p>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Conversations</th>
                <th>First seen</th>
                <th>Last seen</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td>#{v.id.slice(0, 8)}</td>
                  <td>{v.conversationCount}</td>
                  <td>{new Date(v.firstSeen).toLocaleDateString()}</td>
                  <td>{new Date(v.lastSeen).toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: v.hasOpen ? 'var(--accent-soft)' : 'rgba(255,255,255,0.06)',
                        color: v.hasOpen ? 'var(--accent)' : 'var(--text-faint)',
                      }}
                    >
                      {v.hasOpen ? 'active' : 'inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
