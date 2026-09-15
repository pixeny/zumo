import { brand } from '../../config/brand'
import './landing.css'

const ROW_A = [
  { name: 'Vantra Retail', industry: 'Home & Building Materials', color: '#3b82f6' },
  { name: 'Corsa Auto', industry: 'Car Service & Maintenance', color: '#ef4444' },
  { name: 'Haven Estates', industry: 'Real Estate Agency', color: '#06b6d4' },
  { name: 'Purely Wellness', industry: 'Wellness & Medical Retreats', color: '#f97316' },
  { name: 'Meridian Group', industry: 'Real Estate Developer', color: '#ec4899' },
]

const ROW_B = [
  { name: 'Circuit Mobile', industry: 'Electronics & Mobility', color: '#eab308' },
  { name: 'Fernhill Home', industry: 'Consumer Electronics Retail', color: '#8b5cf6' },
  { name: 'Altavue', industry: 'Consumer Electronics Retail', color: '#f59e0b' },
  { name: 'Nordic Devices', industry: 'Consumer Electronics Retail', color: '#22c55e' },
  { name: 'Pinecrest City', industry: 'Hospitality Group', color: '#0ea5e9' },
]

function Row({ items, reverse }) {
  const doubled = [...items, ...items]
  return (
    <div className={`marquee__row ${reverse ? 'marquee__row--reverse' : ''}`}>
      {doubled.map((item, i) => (
        <div className="marquee__card glass-border" key={`${item.name}-${i}`}>
          <div className="marquee__icon" style={{ background: item.color }}>
            {item.name.charAt(0)}
          </div>
          <div>
            <div className="marquee__name">{item.name}</div>
            <div className="marquee__industry">{item.industry}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LogoMarquee() {
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">
            Organizations Running on <span className="section__title-dim">{brand.name}</span>
          </h2>
          <p className="section__subtitle">
            The infrastructure layer powering operations across retail, automotive, hospitality,
            real estate, and service organizations. (Illustrative example organizations.)
          </p>
        </div>
      </div>
      <div className="marquee">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />
      </div>
    </section>
  )
}
