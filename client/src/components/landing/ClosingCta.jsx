import { brand } from '../../config/brand'
import { IconVideo, IconSparkles } from '../icons/Icon'
import './landing.css'

export default function ClosingCta({ onOpenDemo, onOpenChat }) {
  return (
    <section className="section">
      <div className="container">
        <div className="closing-cta glass-border">
          <h2 className="closing-cta__title">Build Your AI-Native Organization</h2>
          <p className="closing-cta__subtitle">
            Transform operations, customer interactions, and workflows with adaptive apps powered
            by AI agents.
          </p>
          <div className="closing-cta__actions glass-border">
            <button className="pill-btn pill-btn--ghost" onClick={onOpenDemo}>
              <IconVideo size={16} />
              Request a Demo
            </button>
            <span className="cta-divider" />
            <button className="pill-btn pill-btn--assistant glass-border glass-hover" onClick={onOpenChat}>
              <span className="pill-btn__avatar">
                <IconSparkles size={12} />
              </span>
              Talk with {brand.assistantName}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
