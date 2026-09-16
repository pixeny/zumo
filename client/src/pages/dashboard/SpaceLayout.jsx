import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { useSpace } from '../../lib/SpaceContext'
import ProfileMenu from '../../components/dashboard/ProfileMenu'
import {
  IconChatBubble,
  IconUsers,
  IconChart,
  IconSettings,
  IconSidebar,
  IconPower,
  IconRobot,
} from '../../components/icons/Icon'
import './dashboard.css'
import './spaces.css'

export default function SpaceLayout() {
  const { id } = useParams()
  const { profile, user, signOut } = useAuth()
  const { space, setActiveSpaceId, unreadBySpace } = useSpace()
  const unread = unreadBySpace[id] || 0
  const [expanded, setExpanded] = useState(false)
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.name ||
    user?.email ||
    'Agent'

  useEffect(() => {
    setActiveSpaceId(id)
  }, [id])

  return (
    <div className="dash">
      <aside className={`dash-sidebar glass-border ${expanded ? 'dash-sidebar--expanded' : ''}`}>
        <Link
          to="/dashboard"
          className="space-card__logo"
          title="Back to Spaces"
          style={{
            width: 40,
            height: 40,
            marginBottom: 8,
            fontSize: 15,
            background: space?.logo_url ? 'transparent' : space?.accent_color || '#4b60ff',
          }}
        >
          {space?.logo_url ? (
            <img src={space.logo_url} alt={space.name} />
          ) : (
            space?.name?.charAt(0).toUpperCase() || '…'
          )}
        </Link>

        <button
          className="dash-sidebar__toggle"
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <IconSidebar size={16} />
        </button>

        <nav className="dash-nav">
          <NavLink
            to={`/dashboard/space/${id}/inbox`}
            title="Inbox"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span
              className="dash-nav__icon"
              style={{ '--tint': '#3b82f6', color: '#3b82f6', position: 'relative' }}
            >
              <IconChatBubble size={14} />
              {unread > 0 && <span className="dash-nav__badge">{unread > 9 ? '9+' : unread}</span>}
            </span>
            <span className="dash-nav__label">Inbox</span>
            {unread > 0 && (
              <span className="dash-nav__label-badge">{unread > 9 ? '9+' : unread}</span>
            )}
          </NavLink>
          <NavLink
            to={`/dashboard/space/${id}/contacts`}
            title="Contacts"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span className="dash-nav__icon" style={{ '--tint': '#f59e0b', color: '#f59e0b' }}>
              <IconUsers size={14} />
            </span>
            <span className="dash-nav__label">Contacts</span>
          </NavLink>
          <NavLink
            to={`/dashboard/space/${id}/analytics`}
            title="Analytics"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span className="dash-nav__icon" style={{ '--tint': '#22c55e', color: '#22c55e' }}>
              <IconChart size={14} />
            </span>
            <span className="dash-nav__label">Analytics</span>
          </NavLink>
          <NavLink
            to={`/dashboard/space/${id}/knowledge-base`}
            title="Knowledge Base"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span className="dash-nav__icon" style={{ '--tint': '#8b5cf6', color: '#8b5cf6' }}>
              <IconRobot size={14} />
            </span>
            <span className="dash-nav__label">Knowledge Base</span>
          </NavLink>
          <NavLink
            to={`/dashboard/space/${id}/settings`}
            title="Settings"
            className={({ isActive }) =>
              `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`
            }
          >
            <span
              className="dash-nav__icon"
              style={{ '--tint': '#a1a1aa', color: 'var(--text-dim)' }}
            >
              <IconSettings size={14} />
            </span>
            <span className="dash-nav__label">Settings</span>
          </NavLink>
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
            to={`/dashboard/space/${id}/settings`}
            className="dash-topbar__btn glass-border"
            title="Settings"
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
