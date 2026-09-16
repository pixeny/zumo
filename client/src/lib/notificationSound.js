const SOUND_URL = '/notification.mp3'

let audio = null
function getAudio() {
  if (!audio) audio = new Audio(SOUND_URL)
  return audio
}

// Plays the shared notification chime. Pass a localStorage key (set from
// Profile Settings > Notifications) to make it opt-out-able per browser;
// omit it for contexts with no such toggle (e.g. the visitor-facing widget).
export function playNotificationSound(prefKey) {
  if (prefKey && localStorage.getItem(prefKey) === 'off') return
  try {
    const a = getAudio()
    a.currentTime = 0
    a.play().catch(() => {})
  } catch {
    // Ignore — autoplay can be blocked before the user has interacted with the page.
  }
}

// Ask once (call from a click handler / on first agent interaction) so the
// browser's native permission prompt isn't a surprise. Safe to call
// repeatedly — the browser just remembers the answer.
export function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') Notification.requestPermission().catch(() => {})
}

// Shows a native OS/browser notification — the only way to reach an agent
// who's on a different tab or app entirely (a sound alone doesn't). Only
// fires when this tab isn't the one currently in view, so the agent isn't
// double-notified while already looking at the message.
export function showBrowserNotification(title, body) {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  if (document.visibilityState === 'visible' && document.hasFocus()) return
  try {
    const n = new Notification(title, { body, icon: '/logo.png', tag: 'zumo-message' })
    n.onclick = () => {
      window.focus()
      n.close()
    }
  } catch {
    // Ignore — some browsers throw if notifications are blocked at the OS level.
  }
}
