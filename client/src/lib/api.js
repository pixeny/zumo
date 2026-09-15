import { supabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

async function authHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

async function authRequest(path, options = {}) {
  return request(path, { ...options, headers: { ...(await authHeaders()), ...options.headers } })
}

export const api = {
  sendChatReply: (conversationId) =>
    request('/api/chat/reply', {
      method: 'POST',
      body: JSON.stringify({ conversationId }),
    }),
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_BASE_URL}/api/uploads`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Upload failed: ${res.status}`)
    }
    return res.json()
  },
  listTeam: () => authRequest('/api/team'),
  inviteTeamMember: (email) =>
    authRequest('/api/team/invite', { method: 'POST', body: JSON.stringify({ email }) }),
  removeTeamMember: (id) => authRequest(`/api/team/${id}`, { method: 'DELETE' }),
  updateTeamMemberRole: (id, role) =>
    authRequest(`/api/team/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
}
