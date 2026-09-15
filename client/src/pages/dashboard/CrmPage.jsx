import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { IconPlus, IconClose, IconEdit, IconTrash } from '../../components/icons/Icon'
import './crud.css'

const EMPTY = { name: '', company: '', email: '', phone: '', notes: '' }

export default function CrmPage() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    setContacts(data ?? [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('contacts').update(form).eq('id', editingId)
    } else {
      await supabase.from('contacts').insert(form)
    }
    setForm(EMPTY)
    setEditingId(null)
    setShowForm(false)
    load()
  }

  function startEdit(contact) {
    setForm({
      name: contact.name || '',
      company: contact.company || '',
      email: contact.email || '',
      phone: contact.phone || '',
      notes: contact.notes || '',
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  async function remove(id) {
    await supabase.from('contacts').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">CRM</h1>
          <p className="dash-header__subtitle">Every contact your team and AI agents talk to.</p>
        </div>
      </div>

      <div className="crud-toolbar">
        <button
          className="pill-btn pill-btn--accent"
          onClick={() => {
            setForm(EMPTY)
            setEditingId(null)
            setShowForm((s) => !s)
          }}
        >
          {showForm ? (
            <>
              <IconClose size={15} />
              Cancel
            </>
          ) : (
            <>
              <IconPlus size={15} />
              Add contact
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="settings-card glass-border" style={{ marginBottom: 20 }}>
          <form onSubmit={handleSubmit}>
            <label className="settings-field">
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="settings-field">
              Company
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="settings-field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="settings-field">
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="settings-field">
              Notes
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            <button className="pill-btn pill-btn--accent" type="submit">
              {editingId ? 'Save changes' : 'Create contact'}
            </button>
          </form>
        </div>
      )}

      <div className="crud-table-wrap glass-border">
        {contacts.length === 0 ? (
          <p className="crud-empty">No contacts yet.</p>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.company}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <div className="crud-row-actions">
                      <button className="crud-icon-btn" onClick={() => startEdit(c)} title="Edit">
                        <IconEdit size={14} />
                      </button>
                      <button className="crud-icon-btn" onClick={() => remove(c.id)} title="Delete">
                        <IconTrash size={14} />
                      </button>
                    </div>
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
