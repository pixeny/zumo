import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { APP_ICONS } from '../../config/appIcons'
import {
  IconPower,
  IconLayers,
  IconSidebar,
  IconSettings,
  IconUsers,
  IconChatBubble,
} from '../../components/icons/Icon'
import { useAuth } from '../../lib/AuthContext'
import ProfileMenu from '../../components/dashboard/ProfileMenu'
import './dashboard.css'

export default function DashboardLayout() {
  const { profile, user, signOut } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.name ||
    user?.email ||
    'Agent'

  return (
    <div className="dash">
      <aside className={`dash-sidebar glass-border ${expanded ? 'dash-sidebar--expanded' : ''}`}>
        <button
          className="dash-sidebar__toggle"
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <IconSidebar size={16} />
        </button>

        <nav className="dash-nav">
          {brand.apps
            .filter((app) => app.id !== 'ai-team')
            .map((app) => {
              const AppIcon = APP_ICONS[app.id]
              return (
                <NavLink
                  key={app.id}
                  to={`/dashboard/workspace/${app.id}`}
                  title={app.label}
                  className={({ isActive }) =>
                    `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
                  }
                >
                  <span
                    className="dash-nav__icon"
                    style={{ '--tint': app.color, color: app.color }}
                  >
                    <AppIcon size={14} />
                  </span>
                  <span className="dash-nav__label">{app.label}</span>
                </NavLink>
              )
            })}
          <NavLink
            to="/dashboard/workspace/team"
            title="Team"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span className="dash-nav__icon" style={{ '--tint': '#06b6d4', color: '#06b6d4' }}>
              <IconUsers size={14} />
            </span>
            <span className="dash-nav__label">Team</span>
          </NavLink>
          <NavLink
            to="/dashboard/workspace/canned-responses"
            title="Canned Responses"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span className="dash-nav__icon" style={{ '--tint': '#facc15', color: '#facc15' }}>
              <IconChatBubble size={14} />
            </span>
            <span className="dash-nav__label">Canned Responses</span>
          </NavLink>
          <Link to="/dashboard" title="Spaces" className="dash-nav__item">
            <span className="dash-nav__icon" style={{ '--tint': '#a855f7', color: '#a855f7' }}>
              <IconLayers size={14} />
            </span>
            <span className="dash-nav__label">Spaces</span>
          </Link>
        </nav>

        <div className="dash-sidebar__footer">
          <div className="dash-sidebar__user">
            <span className="dash-sidebar__user-avatar glass-border">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="dash-sidebar__user-avatar-img" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </span>
            <span className="dash-sidebar__user-name">{displayName}</span>
          </div>
          <button className="dash-signout" title="Sign out" onClick={() => signOut()}>
            <IconPower size={16} />
          </button>
        </div>
      </aside>

      <div className="dash-body">
        <header className="dash-topbar">
          <Link
            to="/dashboard/workspace/team"
            className="dash-topbar__btn glass-border"
            title="Team settings"
          >
            <IconSettings size={16} />
          </Link>
          <ProfileMenu />
        </header>
        <main className="dash-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
