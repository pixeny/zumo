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
