import { useEffect, useRef, useState } from 'react'
import { brand } from '../../config/brand'
import { useAuth } from '../../lib/AuthContext'
import { IconSettings, IconArrowRightCircle } from '../icons/Icon'
import ProfileSettingsModal from './ProfileSettingsModal'
import './profileMenu.css'

export default function ProfileMenu() {
  const { profile, user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const ref = useRef(null)
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.name ||
    user?.email ||
    'Agent'
  const email = user?.email || ''
  const avatarUrl = profile?.avatar_url || null

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="profile-menu-wrap" ref={ref}>
      <button
        className="dash-topbar__avatar glass-border glass-hover"
        title={displayName}
        onClick={() => setOpen((o) => !o)}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="dash-topbar__avatar-img" />
        ) : (
          displayName.charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <div className="profile-menu glass-border">
          <div className="profile-menu__header">
            <span className="profile-menu__avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="profile-menu__avatar-img" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </span>
            <div className="profile-menu__identity">
              <div className="profile-menu__name">{displayName}</div>
              <div className="profile-menu__email">{email}</div>
            </div>
            <button
              className="profile-menu__icon-btn"
              title="Settings"
              onClick={() => {
                setSettingsOpen(true)
                setOpen(false)
              }}
            >
              <IconSettings size={15} />
            </button>
            <button
              className="profile-menu__icon-btn profile-menu__icon-btn--danger"
              title="Sign out"
              onClick={() => signOut()}
            >
              <IconArrowRightCircle size={15} />
            </button>
          </div>
          <div className="profile-menu__footer">
            <span>
              {brand.name}© {new Date().getFullYear()}
            </span>
            <span className="profile-menu__footer-links">
              <a href="#">Privacy</a>
              <span>·</span>
              <a href="#">Terms</a>
            </span>
          </div>
        </div>
      )}

      <ProfileSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
