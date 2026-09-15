import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { brand } from '../../config/brand'
import { IconClose, IconCheck } from '../icons/Icon'
import './modal.css'

export default function DemoModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [status, setStatus] = useState('idle')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('demo_requests').insert(form)
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-border" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IconClose size={18} />
        </button>
        {status === 'sent' ? (
          <div className="modal-success">
            <div className="modal-success__icon">
              <IconCheck size={22} />
            </div>
            <h3>Thanks — we'll be in touch</h3>
            <p>A member of the {brand.name} team will reach out shortly.</p>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Request a Demo</h3>
            <p className="modal-subtitle">Tell us a bit about your organization.</p>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Work email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                Company
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </label>
              {status === 'error' && (
                <p className="modal-error">Something went wrong. Please try again.</p>
              )}
              <button className="pill-btn pill-btn--accent" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Submit request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
