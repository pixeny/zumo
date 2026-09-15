import { IconServer, IconLock, IconShield, IconCheck } from '../icons/Icon'
import './landing.css'

const BADGES = [
  { title: 'Cloud-Native Infra', sub: 'Built on Supabase & Node.js', Icon: IconServer },
  { title: 'Encrypted in Transit', sub: 'TLS everywhere', Icon: IconLock },
  { title: 'Role-Based Access', sub: 'Row-level security policies', Icon: IconShield },
  { title: 'Compliance', sub: 'In progress', Icon: IconCheck },
]

export default function TrustSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Built to Be Trusted</h2>
          <p className="section__subtitle">
            Sensible defaults for security and access control from day one.
          </p>
        </div>
        <div className="trust-badges">
          {BADGES.map(({ title, sub, Icon }) => (
            <div className="trust-badge glass-border" key={title}>
              <div className="trust-badge__icon">
                <Icon size={18} />
              </div>
              <div className="trust-badge__title">{title}</div>
              <div className="trust-badge__sub">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
