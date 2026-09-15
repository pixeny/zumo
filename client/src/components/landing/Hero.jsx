import { brand } from '../../config/brand'
import { APP_ICONS } from '../../config/appIcons'
import { IconVideo, IconSparkles } from '../icons/Icon'
import './landing.css'

export default function Hero({ onOpenDemo, onOpenChat }) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Powered by AI agents that learn your business</p>
        <h1 className="hero__title">
          {brand.heroTitle}
          <span className="hero__title-accent">{brand.heroTitleAccent}</span>
        </h1>
        <p className="hero__subtitle">{brand.heroSubtitle}</p>
        <div className="hero__cta glass-border">
          <button className="pill-btn pill-btn--ghost" onClick={onOpenDemo}>
            <IconVideo size={16} />
            Request a Demo
          </button>
          <span className="cta-divider" />
          <button className="pill-btn pill-btn--assistant glass-border" onClick={onOpenChat}>
            <span className="pill-btn__avatar">
              <IconSparkles size={12} />
            </span>
            Talk with {brand.assistantName}
          </button>
        </div>

        <div className="hero__preview glass-border">
          <div className="hero__preview-top">
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
          </div>
          <div className="hero__apps-grid">
            {brand.apps.map((app) => {
              const AppIcon = APP_ICONS[app.id]
              return (
                <div className="hero__app-card glass-border" key={app.id}>
                  <div
                    className="hero__app-icon"
                    style={{ background: `${app.color}26`, color: app.color }}
                  >
                    <AppIcon size={18} />
                  </div>
                  <div className="hero__app-label">{app.label}</div>
                  <div className="hero__app-desc">{app.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
