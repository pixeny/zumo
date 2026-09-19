import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { APP_ICONS } from '../../config/appIcons'
import './crud.css'
import './home.css'

const CARDS = [
  {
    id: 'contact-center',
    label: 'Contact Center',
    desc: 'View and manage all conversations across every space',
    color: '#3b82f6',
  },
  { id: 'crm', label: 'CRM', desc: 'User profiles and customer history', color: '#f59e0b' },
  { id: 'storage', label: 'Storage', desc: 'Manage files and documents', color: '#ef4444' },
  {
    id: 'analytics',
    label: 'Analytics',
    desc: 'Performance metrics and reports',
    color: '#22c55e',
  },
]

export default function DashboardHome() {
  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">{brand.name} Workspace</h1>
          <p className="dash-header__subtitle">Team-wide tools, shared across every space.</p>
        </div>
      </div>

      <div className="home-grid">
        {CARDS.map((c) => {
          const AppIcon = APP_ICONS[c.id]
          return (
            <Link to={`/dashboard/workspace/${c.id}`} className="home-card glass-border glass-hover" key={c.id}>
              <span
                className="home-card__icon"
                style={{ background: `${c.color}26`, color: c.color }}
              >
                <AppIcon size={20} />
              </span>
              <div className="home-card__title">{c.label}</div>
              <div className="home-card__desc">{c.desc}</div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
