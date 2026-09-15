import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { IconPlus, IconTrash, IconEdit, IconCheck, IconClose } from '../../components/icons/Icon'
import './crud.css'

export default function CannedResponsesPage() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('canned_responses')
      .select('*')
      .order('title', { ascending: true })
    setResponses(data ?? [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    await supabase
      .from('canned_responses')
      .insert({ title: title.trim(), body: body.trim(), created_by: user?.id })
    setTitle('')
    setBody('')
    load()
  }

  function startEdit(r) {
    setEditingId(r.id)
    setEditTitle(r.title)
    setEditBody(r.body)
  }

  async function saveEdit(id) {
    await supabase
      .from('canned_responses')
      .update({ title: editTitle.trim(), body: editBody.trim() })
      .eq('id', id)
    setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    await supabase.from('canned_responses').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Canned Responses</h1>
          <p className="dash-header__subtitle">
            Reusable reply templates your team can insert into any conversation with one click.
          </p>
        </div>
      </div>

      <div className="settings-card glass-border" style={{ marginBottom: 20 }}>
        <form onSubmit={handleCreate}>
          <label className="settings-field">
            Title
            <input
              required
              placeholder="e.g. Refund policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="settings-field">
            Response text
            <textarea
              required
              rows={3}
              placeholder="We offer refunds within 30 days of purchase…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <button className="pill-btn pill-btn--accent" type="submit" style={{ gap: 8 }}>
            <IconPlus size={14} />
            Add response
          </button>
        </form>
      </div>

      <div className="crud-table-wrap glass-border">
        {loading ? (
          <p className="crud-empty">Loading…</p>
        ) : responses.length === 0 ? (
          <p className="crud-empty">No canned responses yet.</p>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Response</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.id}>
                  {editingId === r.id ? (
                    <>
                      <td>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '6px 10px',
                            color: 'var(--text)',
                            fontSize: 13,
                            width: '100%',
                          }}
                        />
                      </td>
                      <td>
                        <input
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '6px 10px',
                            color: 'var(--text)',
                            fontSize: 13,
                            width: '100%',
                          }}
                        />
                      </td>
                      <td>
                        <div className="crud-row-actions">
                          <button className="crud-icon-btn" onClick={() => saveEdit(r.id)} title="Save">
                            <IconCheck size={14} />
                          </button>
                          <button
                            className="crud-icon-btn"
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                          >
                            <IconClose size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{r.title}</td>
                      <td
                        style={{
                          maxWidth: 420,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.body}
                      </td>
                      <td>
                        <div className="crud-row-actions">
                          <button className="crud-icon-btn" onClick={() => startEdit(r)} title="Edit">
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="crud-icon-btn"
                            onClick={() => handleDelete(r.id)}
                            title="Delete"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
