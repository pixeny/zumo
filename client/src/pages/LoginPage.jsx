import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { brand } from '../config/brand'
import {
  IconClose,
  IconUser,
  IconLock,
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconDiscord,
} from '../components/icons/Icon'
import Logo from '../components/icons/Logo'
import './auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email above first, then click "Forgot password?"')
      return
    }
    setResetting(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setResetting(false)
    if (error) {
      setError(error.message)
      return
    }
    setResetSent(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  function handleGoogle() {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  function handleDiscord() {
    supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-modal-header glass-border">
          <span className="auth-modal-header__title">
            <span className="auth-modal-header__icon">
              <Logo size={16} />
            </span>
            Login to your account
          </span>
          <Link to="/" className="auth-modal-header__close">
            <IconClose size={16} />
          </Link>
        </div>

        <div className="auth-card glass-border">
          <div className="auth-oauth-group">
            <button type="button" className="auth-google-btn" onClick={handleGoogle}>
              <IconGoogle size={18} />
              Continue with Google
            </button>
            <button type="button" className="auth-google-btn" onClick={handleDiscord}>
              <IconDiscord size={18} />
              Continue with Discord
            </button>
          </div>
          <div className="auth-divider">Or</div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input">
              <span className="auth-input__icon">
                <IconUser size={16} />
              </span>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-input">
              <span className="auth-input__icon">
                <IconLock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-input__toggle"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            <div className="auth-forgot">
              <button type="button" onClick={handleForgotPassword} disabled={resetting}>
                {resetting ? 'Sending…' : 'Forgot password?'}
              </button>
            </div>
            {resetSent && (
              <p className="auth-success">Password reset link sent — check your email.</p>
            )}
            {error && <p className="auth-error">{error}</p>}
            <button className="pill-btn pill-btn--accent auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="auth-footer">
            Do not have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
