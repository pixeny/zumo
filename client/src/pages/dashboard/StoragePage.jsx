import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { IconUpload, IconFile, IconTrash } from '../../components/icons/Icon'
import './crud.css'

export default function StoragePage() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
    setFiles(data ?? [])
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file)
      await supabase.from('files').insert({
        name: file.name,
        url,
        size_bytes: file.size,
        uploaded_by: user.id,
      })
      load()
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function remove(id) {
    await supabase.from('files').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Storage</h1>
          <p className="dash-header__subtitle">Files uploaded by your team, hosted via ImgHippo.</p>
        </div>
      </div>

      <div className="crud-toolbar">
        <input ref={inputRef} type="file" hidden onChange={handleUpload} />
        <button
          className="pill-btn pill-btn--accent"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <IconUpload size={15} />
          {uploading ? 'Uploading…' : 'Upload file'}
        </button>
      </div>

      {files.length === 0 ? (
        <div className="crud-table-wrap glass-border">
          <p className="crud-empty">No files yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {files.map((f) => (
            <a
              key={f.id}
              className="stat-card glass-border"
              href={f.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block' }}
            >
              {f.url && /\.(png|jpe?g|gif|webp)$/i.test(f.url) ? (
                <img
                  src={f.url}
                  alt={f.name}
                  style={{
                    width: '100%',
                    height: 110,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-faint)',
                    marginBottom: 12,
                  }}
                >
                  <IconFile size={22} />
                </div>
              )}
              <div className="stat-card__label" style={{ wordBreak: 'break-word' }}>
                {f.name}
              </div>
              <button
                className="crud-icon-btn"
                style={{ marginTop: 10, width: 'fit-content' }}
                title="Delete"
                onClick={(e) => {
                  e.preventDefault()
                  remove(f.id)
                }}
              >
                <IconTrash size={14} />
              </button>
            </a>
          ))}
        </div>
      )}
    </>
  )
}
