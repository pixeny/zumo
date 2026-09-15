import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { IconChatBubble } from '../icons/Icon'
import './cannedResponsesButton.css'

export default function CannedResponsesButton({ onInsert }) {
  const [open, setOpen] = useState(false)
  const [responses, setResponses] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleOpen() {
    if (!open) {
      supabase
        .from('canned_responses')
        .select('*')
        .order('title', { ascending: true })
        .then(({ data }) => setResponses(data ?? []))
    }
    setOpen((o) => !o)
  }

  return (
    <div className="canned-btn-wrap" ref={ref}>
      <button
        type="button"
        className="inbox-thread__btn"
        title="Canned responses"
        onClick={handleOpen}
      >
        <IconChatBubble size={13} />
      </button>
      {open && (
        <div className="canned-menu glass-border">
          {responses.length === 0 && (
            <p className="canned-menu__empty">
              No canned responses yet — add some from the Canned Responses page.
            </p>
          )}
          {responses.map((r) => (
            <button
              key={r.id}
              type="button"
              className="canned-menu__item"
              onClick={() => {
                onInsert(r.body)
                setOpen(false)
              }}
            >
              <span className="canned-menu__item-title">{r.title}</span>
              <span className="canned-menu__item-body">{r.body}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
