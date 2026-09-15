import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useSpace } from '../../lib/SpaceContext'
import { IconPlus, IconTrash, IconEdit, IconCheck, IconClose } from '../../components/icons/Icon'
import './crud.css'

export default function SpaceKnowledgeBasePage() {
  const { id: widgetId } = useParams()
  const { space } = useSpace()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editAnswer, setEditAnswer] = useState('')

  useEffect(() => {
    load()
  }, [widgetId])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('widget_id', widgetId)
      .order('created_at', { ascending: false })
    setEntries(data ?? [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return
    await supabase
      .from('knowledge_base')
      .insert({ widget_id: widgetId, question: question.trim(), answer: answer.trim() })
    setQuestion('')
    setAnswer('')
    load()
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditQuestion(entry.question)
    setEditAnswer(entry.answer)
  }

  async function saveEdit(id) {
    await supabase
      .from('knowledge_base')
      .update({ question: editQuestion.trim(), answer: editAnswer.trim() })
      .eq('id', id)
    setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    await supabase.from('knowledge_base').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Knowledge Base</h1>
          <p className="dash-header__subtitle">
            Facts and answers {space?.assistant_name || 'the AI'} uses when replying in this
            space — pricing, policies, hours, anything worth teaching it.
          </p>
        </div>
      </div>

      <div className="settings-card glass-border" style={{ marginBottom: 20 }}>
        <form onSubmit={handleCreate}>
          <label className="settings-field">
            Question
            <input
              required
              placeholder="e.g. What are your business hours?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <label className="settings-field">
            Answer
            <textarea
              required
              rows={3}
              placeholder="We're open Monday to Friday, 9am to 6pm."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
          <button className="pill-btn pill-btn--accent" type="submit" style={{ gap: 8 }}>
            <IconPlus size={14} />
            Add entry
          </button>
        </form>
      </div>

      <div className="crud-table-wrap glass-border">
        {loading ? (
          <p className="crud-empty">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="crud-empty">No knowledge base entries yet.</p>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  {editingId === e.id ? (
                    <>
                      <td>
                        <input
                          value={editQuestion}
                          onChange={(ev) => setEditQuestion(ev.target.value)}
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
                          value={editAnswer}
                          onChange={(ev) => setEditAnswer(ev.target.value)}
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
                          <button className="crud-icon-btn" onClick={() => saveEdit(e.id)} title="Save">
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
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{e.question}</td>
                      <td
                        style={{
                          maxWidth: 420,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {e.answer}
                      </td>
                      <td>
                        <div className="crud-row-actions">
                          <button className="crud-icon-btn" onClick={() => startEdit(e)} title="Edit">
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="crud-icon-btn"
                            onClick={() => handleDelete(e.id)}
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
