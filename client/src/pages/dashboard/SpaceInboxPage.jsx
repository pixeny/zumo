import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext'
import { useSpace } from '../../lib/SpaceContext'
import {
  IconChatBubble,
  IconSearch,
  IconSettings,
  IconEdit,
  IconSparkles,
  IconSend,
} from '../../components/icons/Icon'
import Select from '../../components/ui/Select'
import NotesPanel from '../../components/dashboard/NotesPanel'
import VisitorPanel from '../../components/dashboard/VisitorPanel'
import CannedResponsesButton from '../../components/dashboard/CannedResponsesButton'
import {
  playNotificationSound,
  requestNotificationPermission,
  showBrowserNotification,
} from '../../lib/notificationSound'
import '../../components/chat/chat.css'
import './inbox.css'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
]

export default function SpaceInboxPage() {
  const { id: widgetId } = useParams()
  const { space, clearSpaceUnread, incrementSpaceUnread } = useSpace()
  const { user, profile } = useAuth()
  const [status, setStatus] = useState('open')
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const replyTextareaRef = useRef(null)
  const conversationIdsRef = useRef(new Set())
  const selectedIdRef = useRef(null)

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    requestNotificationPermission()
    clearSpaceUnread(widgetId)
    loadConversationIds()
  }, [widgetId])

  useEffect(() => {
    loadConversations()
    const channel = supabase
      .channel(`space-conversations-${widgetId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `widget_id=eq.${widgetId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            playNotificationSound('zumo_notif_assigned')
            showBrowserNotification(
              'New conversation',
              `${payload.new.visitor_name || 'A visitor'} started a chat in ${space?.name || 'your space'}.`
            )
            incrementSpaceUnread(widgetId)
            conversationIdsRef.current.add(payload.new.id)
          }
          loadConversations()
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, widgetId])

  // Widget-wide message watch, independent of which thread is open — this is
  // what lets a new reply notify/badge even while looking at a different
  // conversation (or a different browser tab entirely; the socket stays
  // connected regardless of tab focus, only the visible alert was missing).
  useEffect(() => {
    const channel = supabase
      .channel(`space-messages-${widgetId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = payload.new
          if (m.sender_type !== 'visitor') return
          if (!conversationIdsRef.current.has(m.conversation_id)) return
          const isOpenThread = m.conversation_id === selectedIdRef.current
          playNotificationSound('zumo_notif_message')
          showBrowserNotification('New message', m.body || 'Sent an attachment')
          if (!isOpenThread || document.visibilityState !== 'visible') {
            incrementSpaceUnread(widgetId)
          }
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [widgetId])

  useEffect(() => {
    if (!selectedId) return
    loadMessages(selectedId)
    const channel = supabase
      .channel(`space-thread-${selectedId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          // Sound/browser-notification for visitor messages is handled by the
          // widget-wide watch above (it needs to cover every thread, not just
          // this one) — this subscription only needs to update the open
          // thread's message list.
          setMessages((prev) =>
            prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]
          )
        }
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('widget_id', widgetId)
      .order('created_at', { ascending: false })
    if (status !== 'all') query = query.eq('status', status)
    const { data } = await query
    setConversations(data ?? [])
  }

  // Kept separate from loadConversations (which is filtered by the visible
  // status tab) so the widget-wide message watch above still recognizes
  // conversations that are e.g. closed or on a different status tab.
  async function loadConversationIds() {
    const { data } = await supabase.from('conversations').select('id').eq('widget_id', widgetId)
    conversationIdsRef.current = new Set((data ?? []).map((c) => c.id))
  }

  async function loadMessages(id) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
  }

  async function assignToMe(id) {
    const { error } = await supabase
      .from('conversations')
      .update({ assigned_agent_id: user.id, status: 'pending' })
      .eq('id', id)
    if (error) return
    const agentName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
      profile?.name ||
      'An agent'
    await supabase.from('messages').insert({
      conversation_id: id,
      sender_type: 'system',
      sender_id: user.id,
      body: `${agentName} joined the conversation.`,
    })
  }

  async function closeConversation(id) {
    await supabase.from('conversations').update({ status: 'closed' }).eq('id', id)
  }

  async function handleReply(e) {
    e.preventDefault()
    const body = reply.trim()
    if (!body || !selectedId) return
    setReply('')
    if (replyTextareaRef.current) replyTextareaRef.current.style.height = 'auto'
    const agentName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
      profile?.name ||
      'Agent'
    await supabase.from('messages').insert({
      conversation_id: selectedId,
      sender_type: 'agent',
      sender_id: user.id,
      sender_name: agentName,
      sender_avatar_url: profile?.avatar_url || null,
      body,
    })
  }

  const filtered = useMemo(
    () => conversations.filter((c) => c.id.slice(0, 8).includes(search.trim().toLowerCase())),
    [conversations, search]
  )
  const selected = conversations.find((c) => c.id === selectedId)

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">{space?.name || 'Inbox'}</h1>
          <p className="dash-header__subtitle">Conversations started from this space's widget.</p>
        </div>
      </div>

      <div className="inbox-toolbar glass-border">
        <div className="inbox-toolbar__title">
          <span className="inbox-toolbar__title-icon">
            <IconChatBubble size={15} />
          </span>
          <span className="inbox-toolbar__title-text">Inbox</span>
        </div>

        <Select
          className="inbox-toolbar__filter"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => {
            setStatus(v)
            setSelectedId(null)
          }}
        />

        <label className="inbox-toolbar__search">
          <IconSearch size={14} />
          <input
            placeholder="Search by conversation ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <Link to={`/dashboard/space/${widgetId}/settings`} className="inbox-toolbar__btn" title="Settings">
          <IconSettings size={15} />
        </Link>
      </div>

      <div className="inbox">
        <div className="inbox-list glass-border">
          <div className="inbox-list__count">
            Showing {filtered.length} of {conversations.length} conversations
          </div>
          <div className="inbox-list__items">
            {filtered.length === 0 && <p className="inbox-empty">No conversations found.</p>}
            {filtered.map((c) => (
              <button
                key={c.id}
                className={`inbox-item glass-border ${selectedId === c.id ? 'inbox-item--active' : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="inbox-item__top">
                  <span className="inbox-item__id">#{c.id.slice(0, 8)}</span>
                  <span className="inbox-item__status">{c.status}</span>
                </div>
                <div className="inbox-item__preview">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="inbox-thread glass-border">
          {!selected ? (
            <p className="inbox-empty" style={{ margin: 'auto' }}>
              Select a conversation to start chatting.
            </p>
          ) : (
            <>
              <div className="inbox-thread__header">
                <div className="inbox-thread__title">
                  <span className="inbox-thread__avatar">
                    {(selected.visitor_name || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="inbox-thread__title-text">
                    <span className="inbox-thread__title-name">
                      {selected.visitor_name || 'Anonymous visitor'}
                    </span>
                    <span className="inbox-thread__title-id">#{selected.id.slice(0, 8)}</span>
                  </div>
                  <span className={`inbox-thread__status-pill inbox-thread__status-pill--${selected.status}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="inbox-thread__actions">
                  <button
                    className={`inbox-thread__btn ${notesOpen ? 'inbox-thread__btn--active' : ''}`}
                    onClick={() => setNotesOpen((o) => !o)}
                  >
                    <IconEdit size={12} style={{ marginRight: 4 }} />
                    Notes
                  </button>
                  {selected.assigned_agent_id !== user.id && (
                    <button
                      className="pill-btn pill-btn--accent"
                      style={{ padding: '7px 16px', fontSize: 12.5 }}
                      onClick={() => assignToMe(selected.id)}
                    >
                      {selected.assigned_agent_id ? 'Take over' : 'Assign to me'}
                    </button>
                  )}
                  <button
                    className="inbox-thread__btn"
                    onClick={() => closeConversation(selected.id)}
                  >
                    Close
                  </button>
                </div>
              </div>
              {notesOpen && <NotesPanel conversationId={selected.id} />}
              <div className="inbox-thread__messages">
                {messages.map((m) =>
                  m.sender_type === 'system' ? (
                    <div key={m.id} className="chat-msg-system">
                      {m.body}
                    </div>
                  ) : (
                    <div key={m.id} className={`inbox-msg-row inbox-msg-row--${m.sender_type}`}>
                      <span className={`inbox-msg-avatar inbox-msg-avatar--${m.sender_type}`}>
                        {m.sender_type === 'visitor' ? (
                          (selected.visitor_name || '?').charAt(0).toUpperCase()
                        ) : m.sender_type === 'agent' ? (
                          m.sender_avatar_url ? (
                            <img src={m.sender_avatar_url} alt="" />
                          ) : (
                            (m.sender_name || 'A').charAt(0).toUpperCase()
                          )
                        ) : (
                          <IconSparkles size={12} />
                        )}
                      </span>
                      <div className="inbox-msg-col">
                        {m.sender_type === 'agent' && m.sender_name && (
                          <span className="inbox-msg-sender">{m.sender_name}</span>
                        )}
                        <div className={`chat-msg chat-msg--${m.sender_type}`}>
                          {m.body}
                          {m.attachment_url && (
                            <img className="chat-msg__img" src={m.attachment_url} alt="attachment" />
                          )}
                        </div>
                        <span className="inbox-msg-time">
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
              {selected.assigned_agent_id === user.id ? (
                <form className="inbox-thread__composer glass-border" onSubmit={handleReply}>
                  <div className="inbox-thread__composer-row">
                    <textarea
                      ref={replyTextareaRef}
                      placeholder="Reply to visitor…"
                      value={reply}
                      rows={1}
                      onChange={(e) => {
                        setReply(e.target.value)
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleReply(e)
                        }
                      }}
                    />
                  </div>
                  <div className="inbox-thread__composer-toolbar">
                    <div className="inbox-thread__composer-tools">
                      <CannedResponsesButton
                        onInsert={(body) => setReply((r) => (r ? `${r} ${body}` : body))}
                      />
                    </div>
                    <button
                      className="inbox-thread__composer-send"
                      type="submit"
                      disabled={!reply.trim()}
                    >
                      Send
                      <IconSend size={13} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="inbox-thread__locked">
                  {selected.assigned_agent_id
                    ? 'This conversation is assigned to another agent.'
                    : 'Assign this conversation to yourself to reply.'}
                </div>
              )}
            </>
          )}
        </div>

        <VisitorPanel
          conversation={selected}
          messageCount={messages.length}
          widgetName={space?.name}
        />
      </div>
    </>
  )
}
