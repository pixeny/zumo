import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { brand } from '../../config/brand'
import { playNotificationSound } from '../../lib/notificationSound'
import {
  IconSparkles,
  IconPaperclip,
  IconSend,
  IconMinus,
  IconThumbsUp,
  IconThumbsDown,
  IconArrowRightCircle,
  IconPlus,
} from '../icons/Icon'
import Logo from '../icons/Logo'
import Select from '../ui/Select'
import './chat.css'

function storageKeyFor(widgetId) {
  return `Zumo_conversation_id_${widgetId || 'default'}`
}

const COUNTRY_CODES = [
  { code: 'GE', dial: '+995' },
  { code: 'US', dial: '+1' },
  { code: 'GB', dial: '+44' },
  { code: 'DE', dial: '+49' },
  { code: 'FR', dial: '+33' },
  { code: 'TR', dial: '+90' },
  { code: 'UA', dial: '+380' },
  { code: 'RU', dial: '+7' },
]

const COUNTRY_CODE_OPTIONS = COUNTRY_CODES.map((c) => ({
  value: c.dial,
  label: `${c.code} ${c.dial}`,
}))

export default function ChatWidget({ open, onOpenChange, widgetId = null, position = 'right' }) {
  const [conversationId, setConversationId] = useState(null)
  const [checkedExisting, setCheckedExisting] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const [widgetConfig, setWidgetConfig] = useState(null)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [countryDial, setCountryDial] = useState('+995')
  const [starting, setStarting] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const channelRef = useRef(null)

  const assistantName = widgetConfig?.assistant_name || brand.assistantName
  const accentColor = widgetConfig?.accent_color || null
  const effectivePosition = widgetConfig?.widget_position || position
  const effectiveTheme = widgetConfig?.widget_theme || 'dark'
  const widgetStyle = accentColor
    ? { '--accent': accentColor, '--accent-glass': `${accentColor}52` }
    : undefined

  useEffect(() => {
    if (!widgetId) return
    supabase
      .from('widgets')
      .select(
        'assistant_name, persona, accent_color, logo_url, greeting_message, widget_position, widget_theme'
      )
      .eq('id', widgetId)
      .maybeSingle()
      .then(({ data }) => data && setWidgetConfig(data))
  }, [widgetId])

  useEffect(() => {
    if (!open || conversationId || checkedExisting) return
    const existingId = localStorage.getItem(storageKeyFor(widgetId))
    if (!existingId) {
      setCheckedExisting(true)
      return
    }
    supabase
      .from('conversations')
      .select('id')
      .eq('id', existingId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setConversationId(data.id)
        } else {
          localStorage.removeItem(storageKeyFor(widgetId))
        }
        setCheckedExisting(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiTyping])

  useEffect(() => {
    if (!conversationId) return
    loadMessages(conversationId)

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          if (payload.new.sender_type !== 'visitor') setAiTyping(false)
          if (payload.new.sender_type === 'ai' || payload.new.sender_type === 'agent') {
            playNotificationSound()
          }
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  async function handleStart(e) {
    e.preventDefault()
    if (!leadName.trim() || starting) return
    setStarting(true)

    let { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error('Anonymous sign-in failed', error)
        setStarting(false)
        return
      }
      sessionData = { session: data.session }
    }
    const userId = sessionData.session.user.id

    const { data: created, error: createError } = await supabase
      .from('conversations')
      .insert({
        customer_id: userId,
        widget_id: widgetId,
        status: 'open',
        visitor_name: leadName.trim(),
        visitor_phone: leadPhone.trim() ? `${countryDial} ${leadPhone.trim()}` : null,
      })
      .select('id')
      .single()

    setStarting(false)

    if (createError) {
      console.error('Failed to create conversation', createError)
      return
    }

    localStorage.setItem(storageKeyFor(widgetId), created.id)
    setConversationId(created.id)
  }

  async function loadMessages(id) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
  }

  async function handleSend(e) {
    e.preventDefault()
    const body = input.trim()
    if (!body || !conversationId || sending) return
    setSending(true)
    setInput('')

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user.id

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_type: 'visitor',
      sender_id: userId,
      body,
    })

    if (!error) {
      setAiTyping(true)
      api.sendChatReply(conversationId).catch((err) => {
        console.error('AI reply failed', err)
        setAiTyping(false)
      })
    }
    setSending(false)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || !conversationId) return
    try {
      const { url } = await api.uploadFile(file)
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_type: 'visitor',
        sender_id: userId,
        body: '',
        attachment_url: url,
      })
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      e.target.value = ''
    }
  }

  function handleLeaveConversation() {
    localStorage.removeItem(storageKeyFor(widgetId))
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setConversationId(null)
    setMessages([])
    setLeadName('')
    setLeadPhone('')
    setCheckedExisting(true)
  }

  async function handleFeedback(messageId, value) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: m.feedback === value ? null : value } : m))
    )
    const current = messages.find((m) => m.id === messageId)
    const next = current?.feedback === value ? null : value
    await supabase.from('messages').update({ feedback: next }).eq('id', messageId)
  }

  if (!open) {
    return (
      <button
        className={`chat-launcher glass-border glass-hover ${effectivePosition === 'left' ? 'chat-launcher--left' : ''} ${effectiveTheme === 'light' ? 'chat-widget--light' : ''}`}
        style={widgetStyle}
        onClick={() => onOpenChange(true)}
      >
        <span className="chat-launcher__avatar chat-launcher__avatar--has-logo">
          <Logo size={20} className="chat-launcher__avatar-img" />
          <span className="chat-launcher__dot" />
        </span>
        <span className="chat-launcher__text">
          <div className="chat-launcher__name">{assistantName}</div>
          <div className="chat-launcher__status">Online now</div>
        </span>
      </button>
    )
  }

  return (
    <div
      className={`chat-panel glass-border ${effectivePosition === 'left' ? 'chat-panel--left' : ''} ${effectiveTheme === 'light' ? 'chat-widget--light' : ''}`}
      style={widgetStyle}
    >
      <div className="chat-panel__topbar">
        <div className="chat-panel__brand glass-border">
          <span className="chat-panel__brand-logo">
            <Logo size={14} />
          </span>
          Powered by <strong>{brand.name}</strong>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {conversationId && (
            <button
              className="chat-panel__minimize glass-border glass-hover"
              onClick={handleLeaveConversation}
              title="Leave this chat and start a new one"
            >
              <IconPlus size={15} />
            </button>
          )}
          <button
            className="chat-panel__minimize glass-border glass-hover"
            onClick={() => onOpenChange(false)}
            title="Minimize"
          >
            <IconMinus size={16} />
          </button>
        </div>
      </div>

      <div className="chat-panel__identity glass-border">
        <span
          className={`chat-launcher__avatar ${widgetConfig?.logo_url ? 'chat-launcher__avatar--has-logo' : ''}`}
          style={{ width: 44, height: 44 }}
        >
          {widgetConfig?.logo_url ? (
            <img
              src={widgetConfig.logo_url}
              alt={assistantName}
              className="chat-launcher__avatar-img"
            />
          ) : (
            <IconSparkles size={18} />
          )}
          <span className="chat-launcher__dot" />
        </span>
        <div>
          <div className="chat-launcher__name">{assistantName}</div>
          <div className="chat-launcher__status">
            {widgetConfig?.persona || 'Visionary Assistant'}
          </div>
        </div>
      </div>

      {!conversationId ? (
        <div className="chat-panel__prechat">
          {checkedExisting && (
            <form className="chat-panel__prechat-form" onSubmit={handleStart}>
              <h2 className="chat-panel__prechat-title">Welcome to secure assistance!</h2>
              <p className="chat-panel__prechat-subtitle">Please, enter your information</p>

              <input
                className="chat-panel__block-input"
                placeholder="Name"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
              />

              <div className="chat-panel__phone-row">
                <Select
                  className="chat-panel__phone-code"
                  value={countryDial}
                  options={COUNTRY_CODE_OPTIONS}
                  onChange={setCountryDial}
                />
                <input
                  className="chat-panel__phone-input"
                  placeholder="Phone number"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                />
              </div>

              <p className="chat-panel__consent">
                By continuing you agree that we and authorized partners may process, monitor, and
                record this chat and your data in line with{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
                .
              </p>

              <button
                type="submit"
                className="pill-btn pill-btn--accent chat-panel__start-btn"
                disabled={starting || !leadName.trim()}
              >
                {starting ? 'Starting…' : 'Start'}
                <IconArrowRightCircle size={16} />
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          <div className="chat-panel__messages">
            {messages.length === 0 && (
              <p className="chat-panel__empty">
                {widgetConfig?.greeting_message ||
                  `Say hello — ${assistantName} is here to help, and a human teammate can jump in any time.`}
              </p>
            )}
            {messages.map((m) =>
              m.sender_type === 'system' ? (
                <div key={m.id} className="chat-msg-system">
                  {m.body}
                </div>
              ) : (
              <div key={m.id} className={`chat-msg-row chat-msg-row--${m.sender_type}`}>
                {m.sender_type === 'agent' && m.sender_name && (
                  <div className="chat-msg-agent">
                    <span className="chat-msg-agent__avatar">
                      {m.sender_avatar_url ? (
                        <img src={m.sender_avatar_url} alt="" />
                      ) : (
                        m.sender_name.charAt(0).toUpperCase()
                      )}
                    </span>
                    {m.sender_name}
                  </div>
                )}
                <div className={`chat-msg chat-msg--${m.sender_type}`}>
                  {m.body}
                  {m.attachment_url && (
                    <img className="chat-msg__img" src={m.attachment_url} alt="attachment" />
                  )}
                </div>
                {m.sender_type !== 'visitor' && (
                  <div className="chat-feedback">
                    <button
                      className={`chat-feedback__btn ${m.feedback === 'up' ? 'chat-feedback__btn--active' : ''}`}
                      title="Helpful"
                      type="button"
                      onClick={() => handleFeedback(m.id, 'up')}
                    >
                      <IconThumbsUp size={13} />
                    </button>
                    <button
                      className={`chat-feedback__btn ${m.feedback === 'down' ? 'chat-feedback__btn--active' : ''}`}
                      title="Not helpful"
                      type="button"
                      onClick={() => handleFeedback(m.id, 'down')}
                    >
                      <IconThumbsDown size={13} />
                    </button>
                  </div>
                )}
              </div>
              )
            )}
            {aiTyping && (
              <div className="chat-panel__typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-panel__composer glass-border" onSubmit={handleSend}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="chat-panel__icon-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach an image"
            >
              <IconPaperclip size={16} />
            </button>
            <input
              className="chat-panel__input"
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="chat-panel__icon-btn chat-panel__send"
              disabled={sending || !input.trim()}
            >
              <IconSend size={15} />
            </button>
          </form>
        </>
      )}
    </div>
  )
}
