import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext'
import { IconSend } from '../icons/Icon'
import './notesPanel.css'

// Internal, agent-only notes attached to a conversation — stored in a
// separate table (conversation_notes) the visitor's RLS policies never
// touch, so nothing written here can leak into the widget.
export default function NotesPanel({ conversationId }) {
  const { user, profile } = useAuth()
  const [notes, setNotes] = useState([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    supabase
      .from('conversation_notes')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setNotes(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`notes-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_notes',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setNotes((prev) => (prev.some((n) => n.id === payload.new.id) ? prev : [...prev, payload.new]))
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [conversationId])

  async function handleAdd(e) {
    e.preventDefault()
    const text = body.trim()
    if (!text) return
    setBody('')
    await supabase.from('conversation_notes').insert({
      conversation_id: conversationId,
      author_id: user.id,
      body: text,
    })
  }

  const authorName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.name || 'You'

  return (
    <div className="notes-panel">
      <div className="notes-panel__list">
        {loading && <p className="notes-panel__empty">Loading notes…</p>}
        {!loading && notes.length === 0 && (
          <p className="notes-panel__empty">
            No internal notes yet. Only your team can see notes — visitors never do.
          </p>
        )}
        {notes.map((n) => (
          <div key={n.id} className="notes-panel__note">
            <div className="notes-panel__note-meta">
              <span>{n.author_id === user.id ? authorName : 'Teammate'}</span>
              <span>{new Date(n.created_at).toLocaleString()}</span>
            </div>
            <div className="notes-panel__note-body">{n.body}</div>
          </div>
        ))}
      </div>
      <form className="notes-panel__composer" onSubmit={handleAdd}>
        <input
          placeholder="Leave a note for your team…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" className="notes-panel__send" title="Add note">
          <IconSend size={14} />
        </button>
      </form>
    </div>
  )
}
