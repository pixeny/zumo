import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'

const router = Router()

// These endpoints use the service-role key to manage auth users directly, so
// every request must prove the caller is a signed-in agent first.
async function requireAgent(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' })

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid session' })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (!profile || !['agent', 'admin'].includes(profile.role)) {
    return res.status(403).json({ error: 'Agent access required' })
  }

  req.userId = userData.user.id
  req.role = profile.role
  next()
}

function requireAdmin(req, res, next) {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
  next()
}

router.use(requireAgent)

router.get('/', async (_req, res) => {
  const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
  if (authError) return res.status(500).json({ error: authError.message })

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, name, first_name, last_name, role, avatar_url')
  if (profileError) return res.status(500).json({ error: profileError.message })

  const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  const team = authUsers.users
    .filter((u) => profileById[u.id])
    .map((u) => {
      const p = profileById[u.id]
      const fullName = [p?.first_name, p?.last_name].filter(Boolean).join(' ')
      return {
        id: u.id,
        email: u.email,
        name: fullName || p?.name || u.email,
        role: p?.role || 'agent',
        avatarUrl: p?.avatar_url || null,
        lastSignInAt: u.last_sign_in_at,
        createdAt: u.created_at,
        confirmed: !!u.email_confirmed_at,
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.json({ team })
})

router.post('/invite', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'email is required' })

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: req.headers.origin ? `${req.headers.origin}/login` : undefined,
  })

  if (error) return res.status(400).json({ error: error.message })
  res.json({ ok: true, userId: data.user.id })
})

router.patch('/:id/role', requireAdmin, async (req, res) => {
  const { role } = req.body
  if (!['agent', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'role must be "agent" or "admin"' })
  }
  if (req.params.id === req.userId) {
    return res.status(400).json({ error: 'You cannot change your own role' })
  }
  const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ ok: true })
})

router.delete('/:id', requireAdmin, async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(400).json({ error: 'You cannot remove your own account' })
  }
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ ok: true })
})

export default router
