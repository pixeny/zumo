import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { brand } from '../config/brand'
import {
  IconClose,
  IconUser,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconGoogle,
  IconDiscord,
} from '../components/icons/Icon'
import Logo from '../components/icons/Logo'
import './auth.css'

export default function SignupPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    const name = `${firstName} ${lastName}`.trim()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // The `profiles` row is created automatically by a database trigger (see
    // supabase/migration_agent_trigger.sql) — no client-side insert needed,
    // since it would fail under RLS whenever email confirmation is pending.
    if (data.session) {
      navigate('/dashboard')
    } else {
      setNeedsConfirmation(true)
    }
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
            Sign up
          </span>
          <Link to="/" className="auth-modal-header__close">
            <IconClose size={16} />
          </Link>
        </div>

        <div className="auth-card glass-border">
          {needsConfirmation ? (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">
                We sent a confirmation link to <strong>{email}</strong>. Confirm your address,
                then sign in.
              </p>
              <p className="auth-footer">
                <Link to="/login">Back to sign in</Link>
              </p>
            </>
          ) : (
            <>
              <p className="auth-top-row">
                Already have an account? <Link to="/login">Log in</Link>
              </p>

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
                <div className="auth-form-row">
                  <div className="auth-input">
                    <span className="auth-input__icon">
                      <IconUser size={16} />
                    </span>
                    <input
                      placeholder="First name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="auth-input">
                    <span className="auth-input__icon">
                      <IconUser size={16} />
                    </span>
                    <input
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-input">
                  <span className="auth-input__icon">
                    <IconMail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-form-row">
                  <div className="auth-input">
                    <span className="auth-input__icon">
                      <IconLock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required
                      minLength={6}
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
                  <div className="auth-input">
                    <span className="auth-input__icon">
                      <IconLock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <p className="auth-terms">
                  By selecting <strong>Agree and continue</strong>, I agree to the{' '}
                  <a href="#">Terms and conditions</a> and <a href="#">Privacy Policy</a> of{' '}
                  {brand.name}.
                </p>

                {error && <p className="auth-error">{error}</p>}
                <button className="pill-btn pill-btn--accent auth-submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Agree and continue'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
