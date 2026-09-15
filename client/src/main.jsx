import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Marks this page as the main Zumo app itself (as opposed to some external
// site that embedded widget.js) — widget-entry.jsx checks this flag so the
// embed script never double-mounts on top of the app's own built-in widget.
window.__ZUMO_APP__ = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
