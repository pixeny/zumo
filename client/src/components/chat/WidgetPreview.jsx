import { IconSparkles, IconPaperclip, IconSend, IconMinus, IconThumbsUp, IconThumbsDown } from '../icons/Icon'
import Logo from '../icons/Logo'
import { brand } from '../../config/brand'
import './chat.css'

const SAMPLE_MESSAGES = [
  { id: 'p1', sender_type: 'visitor', body: 'Hi, do you offer refunds?' },
  { id: 'p2', sender_type: 'ai', body: "Yes — refunds are available within 30 days. Want me to start one for you?" },
]

// Static, non-interactive replica of ChatWidget's open panel, driven entirely by
// props instead of Supabase — used to preview unsaved settings changes live.
export default function WidgetPreview({
  assistantName,
  persona,
  accentColor,
  logoUrl,
  greetingMessage,
  theme = 'dark',
}) {
  const widgetStyle = accentColor
    ? { '--accent': accentColor, '--accent-glass': `${accentColor}52` }
    : undefined

  return (
    <div
      className={`chat-panel glass-border widget-preview ${theme === 'light' ? 'chat-widget--light' : ''}`}
      style={widgetStyle}
    >
      <div className="chat-panel__topbar">
        <div className="chat-panel__brand glass-border">
          <span className="chat-panel__brand-logo">
            <Logo size={14} />
          </span>
          Powered by <strong>{brand.name}</strong>
        </div>
        <button className="chat-panel__minimize glass-border glass-hover" type="button" tabIndex={-1}>
          <IconMinus size={16} />
        </button>
      </div>

      <div className="chat-panel__identity glass-border">
        <span
          className={`chat-launcher__avatar ${logoUrl ? 'chat-launcher__avatar--has-logo' : ''}`}
          style={{ width: 44, height: 44 }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={assistantName} className="chat-launcher__avatar-img" />
          ) : (
            <IconSparkles size={18} />
          )}
          <span className="chat-launcher__dot" />
        </span>
        <div>
          <div className="chat-launcher__name">{assistantName || 'Nova'}</div>
          <div className="chat-launcher__status">{persona || 'Visionary Assistant'}</div>
        </div>
      </div>

      <div className="chat-panel__messages">
        {greetingMessage && <p className="chat-panel__empty">{greetingMessage}</p>}
        {SAMPLE_MESSAGES.map((m) => (
          <div key={m.id} className={`chat-msg-row chat-msg-row--${m.sender_type}`}>
            <div className={`chat-msg chat-msg--${m.sender_type}`}>{m.body}</div>
            {m.sender_type !== 'visitor' && (
              <div className="chat-feedback">
                <button className="chat-feedback__btn" type="button" tabIndex={-1}>
                  <IconThumbsUp size={13} />
                </button>
                <button className="chat-feedback__btn" type="button" tabIndex={-1}>
                  <IconThumbsDown size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-panel__composer glass-border">
        <button type="button" className="chat-panel__icon-btn" tabIndex={-1}>
          <IconPaperclip size={16} />
        </button>
        <input className="chat-panel__input" placeholder="Ask me anything…" readOnly tabIndex={-1} />
        <button type="button" className="chat-panel__icon-btn chat-panel__send" tabIndex={-1}>
          <IconSend size={15} />
        </button>
      </div>
    </div>
  )
}
