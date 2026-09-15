import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { useSpace } from '../../lib/SpaceContext'
import WidgetPreview from '../../components/chat/WidgetPreview'
import Select from '../../components/ui/Select'
import {
  IconCopy,
  IconCheck,
  IconTrash,
  IconBox,
  IconPalette,
  IconRobot,
  IconCode,
  IconImage,
} from '../../components/icons/Icon'
import './crud.css'
import './installation.css'
import './spaces.css'

const EMPTY = {
  name: '',
  description: '',
  logo_url: '',
  accent_color: '#4b60ff',
  greeting_message: '',
  widget_position: 'right',
  assistant_name: 'Nova',
  persona: '',
  system_prompt: '',
  ai_model: 'claude-sonnet-5',
}

const AI_MODELS = [
  { value: 'claude-opus-5', label: 'Claude Opus 5 (most capable)' },
  { value: 'claude-sonnet-5', label: 'Claude Sonnet 5 (recommended)' },
  { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest)' },
]

const COLOR_PRESETS = ['#4b60ff', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

const TABS = [
  {
    id: 'general',
    label: 'General',
    Icon: IconBox,
    title: 'General information',
    desc: 'The name and description you use to recognize this space.',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    Icon: IconPalette,
    title: 'Appearance',
    desc: 'The accent color and first message visitors see.',
  },
  {
    id: 'ai',
    label: 'AI Behavior',
    Icon: IconRobot,
    title: 'AI behavior',
    desc: "The assistant's name, personality, and instructions.",
  },
  {
    id: 'embed',
    label: 'Embed & Danger Zone',
    Icon: IconCode,
    title: 'Embed & danger zone',
    desc: 'Install this widget on your site, or delete this space.',
  },
]

export default function SpaceSettingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { space, refreshSpace } = useSpace()
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState(EMPTY)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'
  const activeTab = TABS.find((t) => t.id === tab)

  useEffect(() => {
    if (space) {
      setForm({
        name: space.name || '',
        description: space.description || '',
        logo_url: space.logo_url || '',
        accent_color: space.accent_color || '#4b60ff',
        greeting_message: space.greeting_message || '',
        widget_position: space.widget_position || 'right',
        assistant_name: space.assistant_name || 'Nova',
        persona: space.persona || '',
        system_prompt: space.system_prompt || '',
        ai_model: space.ai_model || 'claude-sonnet-5',
      })
    }
  }, [space])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file)
      update('logo_url', url)
    } catch (err) {
      console.error('Logo upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('widgets').update(form).eq('id', id)
    refreshSpace?.()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    await supabase.from('widgets').delete().eq('id', id)
    navigate('/dashboard')
  }

  const snippet = `<script src="${origin}/widget.js" data-widget-id="${id}" defer></script>`

  function handleCopy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Space Settings</h1>
          <p className="dash-header__subtitle">Changes preview live on the right.</p>
        </div>
      </div>

      <div className="settings-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`settings-tab ${tab === t.id ? 'settings-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            <t.Icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-layout">
          <div className="settings-card glass-border" style={{ maxWidth: 'none' }}>
            <div className="settings-panel-header">
              <span className="settings-panel-header__icon">
                <activeTab.Icon size={17} />
              </span>
              <div>
                <div className="settings-panel-header__title">{activeTab.title}</div>
                <div className="settings-panel-header__desc">{activeTab.desc}</div>
              </div>
            </div>

            {tab === 'general' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
                <div className="logo-uploader-row">
                  <button
                    type="button"
                    className="space-modal__logo"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="Logo" />
                    ) : (
                      <>
                        <IconImage size={18} />
                        <span>{uploading ? 'Uploading…' : 'Upload'}</span>
                      </>
                    )}
                  </button>
                  <div className="logo-uploader-row__text">
                    <strong>Space logo</strong>
                    Shown as the assistant's avatar in the widget. PNG or JPG works best.
                  </div>
                </div>

                <label className="settings-field">
                  Space name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </label>
                <label className="settings-field">
                  Description / Industry
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </label>
              </>
            )}

            {tab === 'appearance' && (
              <>
                <label className="settings-field">
                  Accent color
                  <div className="color-swatches">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`color-swatch ${form.accent_color === c ? 'color-swatch--active' : ''}`}
                        style={{ background: c }}
                        onClick={() => update('accent_color', c)}
                        title={c}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={form.accent_color}
                    onChange={(e) => update('accent_color', e.target.value)}
                    style={{ height: 42, padding: 4, cursor: 'pointer' }}
                  />
                </label>
                <label className="settings-field">
                  Greeting message
                  <textarea
                    rows={3}
                    placeholder="Say hello — Nova is here to help, and a human teammate can jump in any time."
                    value={form.greeting_message}
                    onChange={(e) => update('greeting_message', e.target.value)}
                  />
                </label>
                <label className="settings-field">
                  Widget position on the page
                  <div className="settings-tabs" style={{ marginTop: 4 }}>
                    <button
                      type="button"
                      className={`settings-tab ${form.widget_position === 'right' ? 'settings-tab--active' : ''}`}
                      onClick={() => update('widget_position', 'right')}
                    >
                      Bottom right
                    </button>
                    <button
                      type="button"
                      className={`settings-tab ${form.widget_position === 'left' ? 'settings-tab--active' : ''}`}
                      onClick={() => update('widget_position', 'left')}
                    >
                      Bottom left
                    </button>
                  </div>
                </label>
              </>
            )}

            {tab === 'ai' && (
              <>
                <label className="settings-field">
                  AI model
                  <Select
                    value={form.ai_model}
                    options={AI_MODELS}
                    onChange={(v) => update('ai_model', v)}
                  />
                </label>
                <label className="settings-field">
                  Assistant name (shown to visitors)
                  <input
                    required
                    value={form.assistant_name}
                    onChange={(e) => update('assistant_name', e.target.value)}
                  />
                </label>
                <label className="settings-field">
                  Persona
                  <input
                    placeholder="Friendly, concise customer support assistant."
                    value={form.persona}
                    onChange={(e) => update('persona', e.target.value)}
                  />
                </label>
                <label className="settings-field">
                  System instructions
                  <textarea
                    rows={6}
                    placeholder="You are a helpful customer support assistant. Answer briefly and clearly."
                    value={form.system_prompt}
                    onChange={(e) => update('system_prompt', e.target.value)}
                  />
                </label>
              </>
            )}

            {tab === 'embed' && (
              <>
                <p style={{ color: 'var(--text-dim)', fontSize: 13.5, margin: '0 0 12px' }}>
                  Paste this before <strong>&lt;/body&gt;</strong> on any site to add this widget.
                </p>
                <div className="code-block" style={{ marginBottom: 16 }}>
                  <button type="button" className="code-block__copy" onClick={handleCopy}>
                    {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <pre style={{ fontSize: 11.5 }}>{snippet}</pre>
                </div>
                <a
                  href={`${origin}/embed-preview.html?widget=${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn pill-btn--ghost"
                  style={{ marginBottom: 24, width: 'fit-content' }}
                >
                  Open a live preview on a separate test page
                </a>

                <div style={{ height: 1, background: 'var(--border-soft)', margin: '0 0 20px' }} />

                <p style={{ color: 'var(--text-dim)', fontSize: 13.5, margin: '0 0 14px' }}>
                  Deleting a space removes its widget and settings. Conversations already
                  collected stay in the database but lose their space link.
                </p>
                <button
                  type="button"
                  className="crud-icon-btn"
                  style={{ width: 'fit-content', gap: 8, padding: '8px 14px' }}
                  onClick={handleDelete}
                >
                  <IconTrash size={14} />
                  Delete this space
                </button>
              </>
            )}

            {tab !== 'embed' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
                <button className="pill-btn pill-btn--accent" type="submit">
                  Save settings
                </button>
                {saved && (
                  <p className="settings-saved" style={{ margin: 0 }}>
                    Saved.
                  </p>
                )}
              </div>
            )}
          </div>

          <WidgetPreview
            assistantName={form.assistant_name}
            persona={form.persona}
            accentColor={form.accent_color}
            logoUrl={form.logo_url}
            greetingMessage={form.greeting_message}
          />
        </div>
      </form>
    </>
  )
}
