import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useSpace } from '../../lib/SpaceContext'
import { IconPlus, IconMore, IconEdit, IconTrash } from '../../components/icons/Icon'
import CreateSpaceModal from './CreateSpaceModal'
import './spaces.css'

export default function SpacesPage() {
  const navigate = useNavigate()
  const { setActiveSpaceId } = useSpace()
  const [spaces, setSpaces] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    setActiveSpaceId(null)
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from('widgets')
      .select('*')
      .order('created_at', { ascending: false })
    setSpaces(data ?? [])
  }

  function enterSpace(id) {
    setActiveSpaceId(id)
    navigate(`/dashboard/space/${id}`)
  }

  async function removeSpace(id) {
    await supabase.from('widgets').delete().eq('id', id)
    setOpenMenuId(null)
    load()
  }

  return (
    <>
      <div className="spaces-header">
        <div>
          <h1 className="spaces-header__title">Your Spaces</h1>
          <p className="spaces-header__subtitle">Manage and configure your agent projects.</p>
        </div>
      </div>

      <div className="spaces-grid">
        <button className="space-card space-card--create glass-border" onClick={() => setShowCreate(true)}>
          <span className="space-card__plus">
            <IconPlus size={16} />
          </span>
          <div className="space-card__title">Create new space</div>
          <div className="space-card__desc">Start a new blank project</div>
        </button>

        {spaces.map((s) => (
          <div key={s.id} className="space-card glass-border" onClick={() => enterSpace(s.id)}>
            <button
              className="space-card__menu"
              onClick={(e) => {
                e.stopPropagation()
                setOpenMenuId(openMenuId === s.id ? null : s.id)
              }}
            >
              <IconMore size={15} />
            </button>
            {openMenuId === s.id && (
              <div className="space-card__menu-dropdown" onClick={(e) => e.stopPropagation()}>
                <button className="space-card__menu-item" onClick={() => enterSpace(s.id)}>
                  <IconEdit size={13} />
                  Open
                </button>
                <button
                  className="space-card__menu-item space-card__menu-item--danger"
                  onClick={() => removeSpace(s.id)}
                >
                  <IconTrash size={13} />
                  Delete
                </button>
              </div>
            )}

            <span
              className="space-card__logo"
              style={{ background: s.logo_url ? 'transparent' : s.accent_color || '#4b60ff' }}
            >
              {s.logo_url ? <img src={s.logo_url} alt={s.name} /> : s.name?.charAt(0).toUpperCase()}
            </span>
            <div className="space-card__title">{s.name}</div>
            <div className="space-card__desc">{s.description || 'No description yet.'}</div>
          </div>
        ))}
      </div>

      <CreateSpaceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => {
          setShowCreate(false)
          load()
          enterSpace(id)
        }}
      />
    </>
  )
}
