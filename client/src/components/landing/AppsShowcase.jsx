import { useState } from 'react'
import { brand } from '../../config/brand'
import { APP_ICONS } from '../../config/appIcons'
import { IconCheck } from '../icons/Icon'
import './landing.css'

const DETAILS = {
  'contact-center': {
    desc: 'A unified inbox where your AI assistant and human agents share every conversation — chat, email, and social — with live handoff whenever a customer needs a person.',
    points: [
      'AI-drafted or fully automated first responses',
      'One-click handoff from AI to a human agent',
      'Full conversation history across channels',
    ],
  },
  crm: {
    desc: 'Every contact, deal, and interaction in one place, automatically enriched as your team and AI agents talk to customers.',
    points: [
      'Auto-created contacts from chat conversations',
      'Pipeline stages and notes your team can edit',
      'Searchable activity timeline per contact',
    ],
  },
  storage: {
    desc: 'A shared file space for the documents, images, and attachments your team and AI agents generate — organized and instantly retrievable.',
    points: ['Drag-and-drop uploads', 'Shareable links for any file', 'Usage visibility by team'],
  },
  analytics: {
    desc: 'Real-time visibility into how your business is running — response times, conversation volume, and team performance at a glance.',
    points: [
      'Conversation volume and resolution trends',
      'Average first-response time',
      'Open vs. closed breakdown',
    ],
  },
  'ai-team': {
    desc: 'Configure the AI teammates working alongside your staff — their name, tone, and what they are allowed to say on your behalf.',
    points: [
      'Custom persona and system instructions',
      'Scoped knowledge per assistant',
      'Human-in-the-loop approval when needed',
    ],
  },
}

export default function AppsShowcase() {
  const [active, setActive] = useState(brand.apps[0].id)
  const activeApp = brand.apps.find((a) => a.id === active)
  const detail = DETAILS[active]
  const ActiveIcon = APP_ICONS[active]

  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Human-AI Native Apps</h2>
          <p className="section__subtitle">
            Adaptive apps designed for real-time collaboration between teams and AI agents.
          </p>
        </div>

        <div className="apps-section">
          <div className="apps-tabs">
            {brand.apps.map((app) => {
              const AppIcon = APP_ICONS[app.id]
              return (
                <button
                  key={app.id}
                  className={`apps-tab ${active === app.id ? 'apps-tab--active' : ''}`}
                  onClick={() => setActive(app.id)}
                >
                  <span
                    className="apps-tab__icon"
                    style={{ background: `${app.color}26`, color: app.color }}
                  >
                    <AppIcon size={15} />
                  </span>
                  {app.label}
                </button>
              )
            })}
          </div>

          <div className="apps-panel glass-border">
            <div
              className="apps-panel__icon"
              style={{ background: `${activeApp.color}26`, color: activeApp.color }}
            >
              <ActiveIcon size={24} />
            </div>
            <h3 className="apps-panel__title">{activeApp.label}</h3>
            <p className="apps-panel__desc">{detail.desc}</p>
            <ul className="apps-panel__list">
              {detail.points.map((p) => (
                <li key={p}>
                  <IconCheck size={14} className="apps-panel__check" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
