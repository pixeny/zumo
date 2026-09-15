import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { IconBox, IconClose, IconImage } from '../../components/icons/Icon'
import '../../components/landing/modal.css'
import './spaces.css'

export default function CreateSpaceModal({ open, onClose, onCreated }) {
  const { user, profile } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  if (!open) return null

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file)
      setLogoUrl(url)
    } catch (err) {
      console.error('Logo upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase
      .from('widgets')
      .insert({
        name,
        description,
        logo_url: logoUrl || null,
        owner_id: user?.id,
        ai_model: profile?.default_ai_model || 'claude-sonnet-5',
      })
      .select('id')
      .single()
    setSaving(false)
    if (error) {
      console.error('Failed to create space', error)
      return
    }
    setName('')
    setDescription('')
    setLogoUrl('')
    onCreated?.(data.id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-border" onClick={(e) => e.stopPropagation()}>
        <div className="space-modal__header">
          <span className="space-modal__header-icon">
            <IconBox size={16} />
          </span>
          <h3 className="modal-title" style={{ margin: 0 }}>
            Create New Space
          </h3>
          <button className="modal-close" style={{ position: 'static', marginLeft: 'auto' }} onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>
        <div className="space-modal__divider" />

        <form onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleLogoChange}
          />
          <button
            type="button"
            className="space-modal__logo"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" />
            ) : (
              <>
                <IconImage size={20} />
                <span>{uploading ? 'Uploading…' : 'Upload Logo'}</span>
              </>
            )}
          </button>

          <label className="settings-field" style={{ marginTop: 22 }}>
            Space Name
            <input
              required
              placeholder="e.g. Customer Support AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="settings-field">
            Description / Industry
            <textarea
              rows={3}
              placeholder="e.g. E-commerce support agent to handle refunds"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="space-modal__divider" />
          <div className="space-modal__actions">
            <button type="button" className="pill-btn pill-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="pill-btn pill-btn--accent"
              disabled={saving || !name.trim()}
            >
              {saving ? 'Creating…' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
