import { IconUser, IconPhone, IconCalendar, IconChatBubble } from '../icons/Icon'
import './visitorPanel.css'

// Real fields only — no invented "device", "IP address", or "tags" data we
// don't actually track. See conversation for what a fuller version would need.
export default function VisitorPanel({ conversation, messageCount, widgetName }) {
  if (!conversation) {
    return (
      <div className="visitor-panel glass-border">
        <p className="inbox-empty" style={{ margin: 'auto' }}>
          Visitor details appear here once you select a conversation.
        </p>
      </div>
    )
  }

  const name = conversation.visitor_name || 'Anonymous visitor'

  return (
    <div className="visitor-panel glass-border">
      <div className="visitor-panel__header">
        <span className="inbox-thread__avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <div className="visitor-panel__name">{name}</div>
          <div className="visitor-panel__id">#{conversation.id.slice(0, 8)}</div>
        </div>
      </div>

      <div className="visitor-panel__section">
        <div className="visitor-panel__row">
          <IconUser size={14} />
          <span>{name}</span>
        </div>
        {conversation.visitor_phone && (
          <div className="visitor-panel__row">
            <IconPhone size={14} />
            <span>{conversation.visitor_phone}</span>
          </div>
        )}
        <div className="visitor-panel__row">
          <IconCalendar size={14} />
          <span>
            First visit{' '}
            {new Date(conversation.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        {widgetName && (
          <div className="visitor-panel__row">
            <IconChatBubble size={14} />
            <span>{widgetName}</span>
          </div>
        )}
      </div>

      <div className="visitor-panel__section">
        <div className="visitor-panel__section-title">Conversation</div>
        <div className="visitor-panel__stats">
          <div className="visitor-panel__stat">
            <div className="visitor-panel__stat-value">{messageCount}</div>
            <div className="visitor-panel__stat-label">Messages</div>
          </div>
          <div className="visitor-panel__stat">
            <div
              className={`inbox-thread__status-pill inbox-thread__status-pill--${conversation.status}`}
            >
              {conversation.status}
            </div>
            <div className="visitor-panel__stat-label">Status</div>
          </div>
        </div>
      </div>
    </div>
  )
}
