import { useState } from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import LogoMarquee from '../components/landing/LogoMarquee'
import AppsShowcase from '../components/landing/AppsShowcase'
import TrustSection from '../components/landing/TrustSection'
import ClosingCta from '../components/landing/ClosingCta'
import Footer from '../components/landing/Footer'
import DemoModal from '../components/landing/DemoModal'
import ChatWidget from '../components/chat/ChatWidget'

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="landing">
      <Navbar />
      <Hero onOpenDemo={() => setDemoOpen(true)} onOpenChat={() => setChatOpen(true)} />
      <LogoMarquee />
      <AppsShowcase />
      <TrustSection />
      <ClosingCta onOpenDemo={() => setDemoOpen(true)} onOpenChat={() => setChatOpen(true)} />
      <Footer />

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  )
}
