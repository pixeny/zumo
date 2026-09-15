import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { IconMail, IconTrash, IconCheck } from '../../components/icons/Icon'
import Select from '../../components/ui/Select'
import '../auth.css'
import './crud.css'

const ROLE_OPTIONS = [
  { value: 'agent', label: 'Agent' },
  { value: 'admin', label: 'Admin' },
]

export default function TeamPage() {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [team, setTeam] = useState([])
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { team } = await api.listTeam()
      setTeam(team)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e) {
    e.preventDefault()
    setInviting(true)
    setError('')
    setNotice('')
    try {
      await api.inviteTeamMember(email.trim())
      setNotice(`Invite sent to ${email.trim()}.`)
      setEmail('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(id) {
    setError('')
    try {
      await api.removeTeamMember(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRoleChange(id, role) {
    setError('')
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
    try {
      await api.updateTeamMemberRole(id, role)
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Team</h1>
          <p className="dash-header__subtitle">
            Invite operators to help staff your Contact Center inbox.
          </p>
        </div>
      </div>

      <div className="settings-card glass-border" style={{ marginBottom: 20 }}>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <label className="settings-field" style={{ flex: 1, marginBottom: 0 }}>
            Invite by email
            <div className="auth-input" style={{ margin: 0 }}>
              <span className="auth-input__icon">
                <IconMail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="teammate@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <button className="pill-btn pill-btn--accent" type="submit" disabled={inviting}>
            {inviting ? 'Sending…' : 'Send invite'}
          </button>
        </form>
        {notice && (
          <p className="auth-success" style={{ marginTop: 12 }}>
            <IconCheck size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
            {notice}
          </p>
        )}
        {error && (
          <p className="auth-error" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
      </div>

      <div className="crud-table-wrap glass-border">
        {loading ? (
          <p className="crud-empty">Loading team…</p>
        ) : team.length === 0 ? (
          <p className="crud-empty">No operators yet.</p>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className="glass-border"
                        style={{
                          position: 'relative',
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent-2), var(--accent))',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt=""
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          m.name.charAt(0).toUpperCase()
                        )}
                      </span>
                      {m.name}
                    </div>
                  </td>
                  <td>{m.email}</td>
                  <td>
                    {isAdmin && m.id !== user?.id ? (
                      <Select
                        value={m.role}
                        options={ROLE_OPTIONS}
                        onChange={(role) => handleRoleChange(m.id, role)}
                        className="team-role-select"
                      />
                    ) : (
                      <span style={{ textTransform: 'capitalize' }}>{m.role}</span>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: m.confirmed ? 'var(--accent-soft)' : 'rgba(255,255,255,0.06)',
                        color: m.confirmed ? 'var(--accent)' : 'var(--text-faint)',
                      }}
                    >
                      {m.confirmed ? 'Active' : 'Invited'}
                    </span>
                  </td>
                  <td>
                    {isAdmin && m.id !== user?.id && (
                      <div className="crud-row-actions">
                        <button
                          className="crud-icon-btn"
                          title="Remove"
                          onClick={() => handleRemove(m.id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
