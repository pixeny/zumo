import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import {
  IconClose,
  IconSettings,
  IconUser,
  IconBell,
  IconLock,
  IconMonitor,
  IconHistory,
  IconCamera,
  IconEdit,
  IconCheck,
  IconMail,
  IconPhone,
  IconCake,
  IconGender,
  IconShield,
  IconKey,
  IconChatBubble,
} from '../icons/Icon'
import Select from '../ui/Select'
import './profileSettingsModal.css'

const AI_MODELS = [
  { value: 'claude-opus-5', label: 'Claude Opus 5 (most capable)' },
  { value: 'claude-sonnet-5', label: 'Claude Sonnet 5 (recommended)' },
  { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest)' },
]

const NAV = [
  { id: 'profile', label: 'Profile', Icon: IconUser },
  { id: 'notifications', label: 'Notifications', Icon: IconBell },
  { id: 'security', label: 'Security', Icon: IconLock },
  { id: 'devices', label: 'Devices', Icon: IconMonitor },
  { id: 'activity', label: 'Activity', Icon: IconHistory },
]

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function EditableRow({ Icon, label, value, onSave, type = 'text', options }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    setDraft(value || '')
  }, [value])

  function commit() {
    setEditing(false)
    if (draft !== (value || '')) onSave(draft)
  }

  return (
    <div className="psm-row">
      <span className="psm-row__icon">
        <Icon size={16} />
      </span>
      <div className="psm-row__body">
        <div className="psm-row__label">{label}</div>
        {editing ? (
          options ? (
            <Select
              className="psm-row__select"
              value={draft}
              options={options.map((o) => ({ value: o, label: o }))}
              placeholder="—"
              onChange={(v) => {
                setDraft(v)
                setEditing(false)
                if (v !== (value || '')) onSave(v)
              }}
            />
          ) : (
            <input
              autoFocus
              className="psm-row__input"
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
            />
          )
        ) : (
          <div className="psm-row__value">{value || '—'}</div>
        )}
      </div>
      {onSave &&
        (editing ? (
          <button type="button" className="psm-row__edit" onClick={commit}>
            <IconCheck size={14} />
          </button>
        ) : (
          <button type="button" className="psm-row__edit" onClick={() => setEditing(true)}>
            <IconEdit size={14} />
          </button>
        ))}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`psm-toggle ${checked ? 'psm-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="psm-toggle__dot" />
    </button>
  )
}

export default function ProfileSettingsModal({ open, onClose }) {
  const { user, profile, refreshProfile } = useAuth()
  const [tab, setTab] = useState('profile')
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const [defaultModel, setDefaultModel] = useState('claude-sonnet-5')
  const [assignedSound, setAssignedSound] = useState(true)
  const [messageSound, setMessageSound] = useState(true)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)

  const isGoogleAccount = user?.app_metadata?.provider === 'google'
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.name ||
    user?.email ||
    'Agent'

  useEffect(() => {
    if (!open) return
    setTab('profile')
    setDefaultModel(profile?.default_ai_model || 'claude-sonnet-5')
    setAssignedSound(localStorage.getItem('zumo_notif_assigned') !== 'off')
    setMessageSound(localStorage.getItem('zumo_notif_message') !== 'off')
    setShowPasswordForm(false)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMsg('')
  }, [open, profile])

  useEffect(() => {
    if (!open || tab !== 'activity' || !user) return
    setActivityLoading(true)
    supabase
      .from('messages')
      .select('id, conversation_id, body, created_at')
      .eq('sender_type', 'agent')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setActivity(data || [])
        setActivityLoading(false)
      })
  }, [open, tab, user])

  if (!open) return null

  async function saveField(fields) {
    const { error } = await supabase.from('profiles').update(fields).eq('id', user.id)
    if (error) {
      console.error('Failed to update profile', error)
      return
    }
    refreshProfile()
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file)
      await saveField({ avatar_url: url })
    } catch (err) {
      console.error('Avatar upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  async function saveDefaultModel(value) {
    setDefaultModel(value)
    await saveField({ default_ai_model: value })
  }

  function toggleAssignedSound(v) {
    setAssignedSound(v)
    localStorage.setItem('zumo_notif_assigned', v ? 'on' : 'off')
  }

  function toggleMessageSound(v) {
    setMessageSound(v)
    localStorage.setItem('zumo_notif_message', v ? 'on' : 'off')
  }

  async function handlePasswordSave(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) {
      setPasswordMsg(error.message)
      return
    }
    setPasswordMsg('Password updated.')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setShowPasswordForm(false), 1200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="psm-card glass-border" onClick={(e) => e.stopPropagation()}>
        <div className="psm-header">
         
          <div>
            <div className="psm-header__title">Settings</div>
            <div className="psm-header__subtitle">
              {NAV.find((n) => n.id === tab)?.label}
            </div>
          </div>
          <button className="psm-close" onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>

        <div className="psm-body">
          <div className="psm-nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`psm-nav__item ${tab === n.id ? 'psm-nav__item--active' : ''}`}
                onClick={() => setTab(n.id)}
              >
                <n.Icon size={16} />
                {n.label}
              </button>
            ))}
          </div>

          <div className="psm-panel">
            {tab === 'profile' && (
              <>
                <div className="psm-avatar-block glass-border">
                  <div className="psm-avatar">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" />
                    ) : (
                      <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                    <button
                      type="button"
                      className="psm-avatar__camera"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <IconCamera size={14} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="psm-field-card glass-border">
                  <EditableRow
                    Icon={IconUser}
                    label="First name"
                    value={profile?.first_name}
                    onSave={(v) => saveField({ first_name: v })}
                  />
                  <EditableRow
                    Icon={IconUser}
                    label="Last name"
                    value={profile?.last_name}
                    onSave={(v) => saveField({ last_name: v })}
                  />
                  <EditableRow
                    Icon={IconCake}
                    label="Birthday"
                    type="date"
                    value={profile?.birthday}
                    onSave={(v) => saveField({ birthday: v || null })}
                  />
                  <EditableRow
                    Icon={IconGender}
                    label="Gender"
                    value={profile?.gender}
                    options={['Male', 'Female', 'Other', 'Prefer not to say']}
                    onSave={(v) => saveField({ gender: v || null })}
                  />
                  <EditableRow
                    Icon={IconPhone}
                    label="Phone"
                    value={profile?.phone}
                    onSave={(v) => saveField({ phone: v })}
                  />
                  <EditableRow Icon={IconMail} label="Email" value={user?.email} onSave={null} />
                </div>

                <label className="psm-inline-field">
                  Default AI model for new spaces
                  <Select value={defaultModel} options={AI_MODELS} onChange={saveDefaultModel} />
                </label>
              </>
            )}

            {tab === 'notifications' && (
              <div className="psm-field-card glass-border">
                <div className="psm-section-title">Chat sounds</div>
                <div className="psm-row">
                  <span className="psm-row__icon psm-row__icon--accent">
                    <IconChatBubble size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">Assigned chat alerts</div>
                    <div className="psm-row__value psm-row__value--dim">
                      A chime when a new conversation is assigned to you.
                    </div>
                  </div>
                  <Toggle checked={assignedSound} onChange={toggleAssignedSound} />
                </div>
                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconBell size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">The chat you're reading</div>
                    <div className="psm-row__value psm-row__value--dim">
                      A softer tone for messages in the conversation already open.
                    </div>
                  </div>
                  <Toggle checked={messageSound} onChange={toggleMessageSound} />
                </div>
                <p className="psm-hint">
                  Saved on this browser, so you can silence a shared machine without changing
                  anything for yourself elsewhere.
                </p>
              </div>
            )}

            {tab === 'security' && (
              <div className="psm-field-card glass-border">
                <div className="psm-section-title">Sign in methods</div>
                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconMail size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">Email</div>
                    <div className="psm-row__value">{user?.email}</div>
                  </div>
                </div>

                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconLock size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">Password</div>
                    <div className="psm-row__value psm-row__value--dim">
                      {isGoogleAccount ? 'Managed by your connected Google account' : 'Change your password'}
                    </div>
                  </div>
                  {!isGoogleAccount && (
                    <button
                      type="button"
                      className="psm-pill-btn"
                      onClick={() => setShowPasswordForm((s) => !s)}
                    >
                      {showPasswordForm ? 'Cancel' : 'Change'}
                    </button>
                  )}
                </div>

                {showPasswordForm && !isGoogleAccount && (
                  <form className="psm-password-form" onSubmit={handlePasswordSave}>
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordMsg && <p className="psm-hint">{passwordMsg}</p>}
                    <button type="submit" className="pill-btn pill-btn--accent" disabled={passwordSaving}>
                      {passwordSaving ? 'Saving…' : 'Save password'}
                    </button>
                  </form>
                )}

                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconShield size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">Two-factor authentication</div>
                    <div className="psm-row__value psm-row__value--dim">Not enabled</div>
                  </div>
                  <button type="button" className="psm-pill-btn" disabled title="Coming soon">
                    Coming soon
                  </button>
                </div>

                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconKey size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">Passkeys</div>
                    <div className="psm-row__value psm-row__value--dim">
                      Passwordless sign-in with biometrics or a security key
                    </div>
                  </div>
                  <button type="button" className="psm-pill-btn" disabled title="Coming soon">
                    Coming soon
                  </button>
                </div>
              </div>
            )}

            {tab === 'devices' && (
              <div className="psm-field-card glass-border">
                <div className="psm-section-title">Where you're signed in</div>
                <div className="psm-row">
                  <span className="psm-row__icon">
                    <IconMonitor size={16} />
                  </span>
                  <div className="psm-row__body">
                    <div className="psm-row__label">This browser</div>
                    <div className="psm-row__value psm-row__value--dim">Signed in now</div>
                  </div>
                  <span className="psm-badge">This device</span>
                </div>
              </div>
            )}

            {tab === 'activity' && (
              <div className="psm-field-card glass-border">
                <div className="psm-section-title">Recent activity</div>
                {activityLoading && <p className="psm-hint">Loading…</p>}
                {!activityLoading && activity.length === 0 && (
                  <p className="psm-hint">No recent activity yet.</p>
                )}
                {activity.map((m) => (
                  <div key={m.id} className="psm-row">
                    <span className="psm-row__icon">
                      <IconChatBubble size={16} />
                    </span>
                    <div className="psm-row__body">
                      <div className="psm-row__label">Replied in a conversation</div>
                      <div className="psm-row__value psm-row__value--dim">
                        {m.body ? `"${m.body.slice(0, 60)}${m.body.length > 60 ? '…' : ''}"` : 'Sent an attachment'}
                      </div>
                    </div>
                    <span className="psm-row__time">{timeAgo(m.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
