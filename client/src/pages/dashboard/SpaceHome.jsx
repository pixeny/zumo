import { Link, useParams } from 'react-router-dom'
import { useSpace } from '../../lib/SpaceContext'
import {
  IconChatBubble,
  IconUsers,
  IconChart,
  IconSettings,
  IconRobot,
} from '../../components/icons/Icon'
import './crud.css'
import './home.css'

const CARDS = [
  {
    id: 'inbox',
    label: 'Inbox',
    desc: 'View and reply to conversations from this widget',
    color: '#3b82f6',
    Icon: IconChatBubble,
    href: (id) => `/dashboard/space/${id}/inbox`,
  },
  {
    id: 'contacts',
    label: 'Contacts',
    desc: 'Everyone who has talked to this widget',
    color: '#f59e0b',
    Icon: IconUsers,
    href: (id) => `/dashboard/space/${id}/contacts`,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    desc: 'Volume, status breakdown, and message counts',
    color: '#22c55e',
    Icon: IconChart,
    href: (id) => `/dashboard/space/${id}/analytics`,
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    desc: 'Teach the AI facts, pricing, and policies for this space',
    color: '#8b5cf6',
    Icon: IconRobot,
    href: (id) => `/dashboard/space/${id}/knowledge-base`,
  },
  {
    id: 'canned-responses',
    label: 'Canned Responses',
    desc: 'Reusable reply templates your operators can insert with one click',
    color: '#facc15',
    Icon: IconChatBubble,
    href: () => '/dashboard/workspace/canned-responses',
  },
  {
    id: 'team',
    label: 'Team',
    desc: 'Invite operators and manage roles across your workspace',
    color: '#06b6d4',
    Icon: IconUsers,
    href: () => '/dashboard/workspace/team',
  },
  {
    id: 'settings',
    label: 'Settings',
    desc: 'Branding, assistant persona, and embed code',
    color: '#a1a1aa',
    Icon: IconSettings,
    href: (id) => `/dashboard/space/${id}/settings`,
  },
]

export default function SpaceHome() {
  const { id } = useParams()
  const { space } = useSpace()

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">{space?.name || 'Space'}</h1>
          <p className="dash-header__subtitle">
            {space?.description || 'Manage this widget.'}
          </p>
        </div>
      </div>

      <div className="home-grid">
        {CARDS.map((c) => (
          <Link to={c.href(id)} className="home-card glass-border glass-hover" key={c.id}>
            <span className="home-card__icon" style={{ background: `${c.color}26`, color: c.color }}>
              <c.Icon size={20} />
            </span>
            <div className="home-card__title">{c.label}</div>
            <div className="home-card__desc">{c.desc}</div>
          </Link>
        ))}
      </div>
    </>
  )
}
