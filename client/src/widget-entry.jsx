import { useState } from 'react'
import { createRoot } from 'react-dom/client'
// chat.css styles everything in terms of design-token CSS variables
// (--accent, --bg-glass-tertiary, --radius-lg, --gradient-stroke, ...) and the
// .glass-border/.glass-pill utility classes — all defined here. The main app
// gets these for free via index.css (which imports tokens.css BEFORE any
// component CSS), but this is a *standalone* bundle embedded on someone
// else's site, which never loads that file on its own.
//
// This import must come before the ChatWidget import below: bundlers place
// CSS in module-discovery order, and tokens.css's ".glass-border { position:
// relative }" has the same specificity as chat.css's ".chat-launcher {
// position: fixed }" — whichever rule lands later in the stylesheet wins.
// Importing tokens.css second (as originally written) put it after chat.css,
// so it silently overrode the widget's fixed positioning to relative,
// making it render inline in the page instead of floating in a corner.
import './styles/tokens.css'
import ChatWidget from './components/chat/ChatWidget'

// Captured synchronously while this script is executing — document.currentScript
// is only valid during that window, so grab it now and reuse the reference later.
const THIS_SCRIPT =
  document.currentScript || document.querySelector('script[src*="widget.js"]')
const WIDGET_ID = THIS_SCRIPT?.dataset?.widgetId || null

// Root-relative asset paths (e.g. Logo's "/logo.png") resolve against the
// *host page's* origin when embedded on someone else's site, not against
// where widget.js actually lives — this makes those assets resolve correctly.
if (THIS_SCRIPT?.src) {
  try {
    window.__ZUMO_WIDGET_ORIGIN__ = new URL(THIS_SCRIPT.src).origin
  } catch {
    // Ignore malformed script src — components fall back to a relative path.
  }
}

// If this script ends up on the Zumo app's own pages (which already render a
// built-in ChatWidget bottom-right) AND it's carrying a specific widget id —
// not a bare/default embed — render it bottom-left instead so both are
// visible at once rather than overlapping or silently refusing to mount.
const ON_ZUMO_APP = !!window.__ZUMO_APP__

function StandaloneWidget() {
  const [open, setOpen] = useState(false)
  return (
    <ChatWidget
      open={open}
      onOpenChange={setOpen}
      widgetId={WIDGET_ID}
      position={ON_ZUMO_APP ? 'left' : 'right'}
    />
  )
}

function injectStylesheet() {
  if (document.getElementById('Zumo-widget-styles') || !THIS_SCRIPT?.src) return
  const cssUrl = THIS_SCRIPT.src.replace(/widget\.js(\?.*)?$/, 'widget.css')
  const link = document.createElement('link')
  link.id = 'Zumo-widget-styles'
  link.rel = 'stylesheet'
  link.href = cssUrl
  document.head.appendChild(link)
}

function mount() {
  if (ON_ZUMO_APP && !WIDGET_ID) {
    console.warn(
      'Zumo widget.js: skipped mounting a bare/default embed — this page is the Zumo app ' +
        'itself, which already renders that exact same default widget. Add data-widget-id to ' +
        'test a specific space\'s widget here instead, and it will render bottom-left.'
    )
    return
  }
  if (document.getElementById('Zumo-widget-root')) return
  injectStylesheet()
  const el = document.createElement('div')
  el.id = 'Zumo-widget-root'
  document.body.appendChild(el)
  createRoot(el).render(<StandaloneWidget />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
