const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 18, children, style, ...rest }) {
  // Inside a flex container, an <svg> sized only via width/height attributes
  // (not CSS) can shrink all the way to 0 width — its flex min-width:auto
  // resolves to a 0 min-content size, so default flex-shrink:1 collapses it
  // even with no real space pressure. flex-shrink:0 stops that.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ flexShrink: 0, ...style }}
      {...base}
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconGlobe(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4.2 5.7 4.2 9s-1.4 6.4-4.2 9c-2.8-2.6-4.2-5.7-4.2-9s1.4-6.4 4.2-9Z" />
    </Svg>
  )
}

export function IconArrowRightCircle(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 8.5 13 12l-3.5 3.5M8 12h6" />
    </Svg>
  )
}

export function IconVideo(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="12" height="12" rx="2.5" />
      <path d="m15 10 5.2-3v10L15 14" />
    </Svg>
  )
}

export function IconSparkles(props) {
  return (
    <Svg {...props}>
      <path d="M11 3v3M11 17v3M3 10h3M17 10h3M5.5 5.5l2 2M14.5 5.5l-2 2" />
      <path d="M11 6.5c.5 2 1.5 3 3.5 3.5-2 .5-3 1.5-3.5 3.5-.5-2-1.5-3-3.5-3.5 2-.5 3-1.5 3.5-3.5Z" />
    </Svg>
  )
}

export function IconChatBubble(props) {
  return (
    <Svg {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
    </Svg>
  )
}

export function IconUsers(props) {
  return (
    <Svg {...props}>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M2.5 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 13.6c2.4.5 4 2.3 4 5.4" />
    </Svg>
  )
}

export function IconArchive(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="4.5" rx="1.3" />
      <path d="M4.5 8.5V18a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 18V8.5" />
      <path d="M10 12.5h4" />
    </Svg>
  )
}

export function IconChart(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Svg>
  )
}

export function IconRobot(props) {
  return (
    <Svg {...props}>
      <rect x="4.5" y="8.5" width="15" height="11" rx="3" />
      <path d="M12 8.5V5M9 4.3h6" />
      <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9 17.3h6" />
      <path d="M2.5 12v3M21.5 12v3" />
    </Svg>
  )
}

export function IconSend(props) {
  return (
    <Svg {...props}>
      <path d="M21 3 3 10.5l7.3 2.9L13.2 21 21 3Z" />
      <path d="M10.3 13.4 21 3" />
    </Svg>
  )
}

export function IconPaperclip(props) {
  return (
    <Svg {...props}>
      <path d="M17.5 8.5 9.9 16.1a3 3 0 1 1-4.2-4.2l8.5-8.5a5 5 0 1 1 7 7L12.7 19a2 2 0 1 1-3-3l7.4-7.4" />
    </Svg>
  )
}

export function IconClose(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function IconPower(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v9" />
      <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
    </Svg>
  )
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function IconEdit(props) {
  return (
    <Svg {...props}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m14 6.5 3.5 3.5" />
    </Svg>
  )
}

export function IconTrash(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M6.5 7 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
    </Svg>
  )
}

export function IconUpload(props) {
  return (
    <Svg {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    </Svg>
  )
}

export function IconFile(props) {
  return (
    <Svg {...props}>
      <path d="M6.5 3.5h7l4 4v13a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5v4h4" />
    </Svg>
  )
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5 9.5 17 19 7" />
    </Svg>
  )
}

export function IconShield(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 19.5 6.5V11c0 5-3.3 8.3-7.5 9.5C7.8 19.3 4.5 16 4.5 11V6.5L12 3.5Z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  )
}

export function IconLock(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </Svg>
  )
}

export function IconMinus(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
    </Svg>
  )
}

export function IconThumbsUp(props) {
  return (
    <Svg {...props}>
      <path d="M8 10.5v9h9.2a2 2 0 0 0 2-1.7l.9-6a2 2 0 0 0-2-2.3h-4.6l.6-3.4a1.8 1.8 0 0 0-3.3-1.3L8 10.5Z" />
      <path d="M8 10.5H5.5A1.5 1.5 0 0 0 4 12v6a1.5 1.5 0 0 0 1.5 1.5H8" />
    </Svg>
  )
}

export function IconThumbsDown(props) {
  return (
    <Svg {...props}>
      <path d="M16 13.5v-9H6.8a2 2 0 0 0-2 1.7l-.9 6a2 2 0 0 0 2 2.3h4.6l-.6 3.4a1.8 1.8 0 0 0 3.3 1.3L16 13.5Z" />
      <path d="M16 13.5h2.5A1.5 1.5 0 0 0 20 12V6a1.5 1.5 0 0 0-1.5-1.5H16" />
    </Svg>
  )
}

export function IconCode(props) {
  return (
    <Svg {...props}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </Svg>
  )
}

export function IconCopy(props) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6.5 15H5.5A1.5 1.5 0 0 1 4 13.5v-8A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5v1" />
    </Svg>
  )
}

export function IconLayers(props) {
  return (
    <Svg {...props}>
      <path d="m12 3.5 8.5 4.5-8.5 4.5-8.5-4.5 8.5-4.5Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </Svg>
  )
}

export function IconBox(props) {
  return (
    <Svg {...props}>
      <path d="m3.5 7.5 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 7.5v9l8.5 4 8.5-4v-9" />
      <path d="M12 11.5v9" />
    </Svg>
  )
}

export function IconImage(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4.5 17 4.5-4.5a2 2 0 0 1 2.8 0L14 14.7l2.2-2.2a2 2 0 0 1 2.8 0l1.5 1.5" />
    </Svg>
  )
}

export function IconMore(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.3" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconSearch(props) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
    </Svg>
  )
}

export function IconFilter(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 5h17M6.5 12h11M10 19h4" />
    </Svg>
  )
}

export function IconUser(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.6 3-6.2 7.5-6.2s7.5 2.6 7.5 6.2" />
    </Svg>
  )
}

export function IconMail(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 6.5 8 6 8-6" />
    </Svg>
  )
}

export function IconPhone(props) {
  return (
    <Svg {...props}>
      <path d="M5.5 4h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />
    </Svg>
  )
}

export function IconEye(props) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </Svg>
  )
}

export function IconEyeOff(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.3 4.1M7 6.9A15.4 15.4 0 0 0 2.5 12S6 18.5 12 18.5a10.4 10.4 0 0 0 3.4-.6" />
      <path d="M9.9 10a2.8 2.8 0 0 0 4 4" />
    </Svg>
  )
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

export function IconCalendar(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </Svg>
  )
}

export function IconSettings(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1h-.2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </Svg>
  )
}

export function IconMoon(props) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </Svg>
  )
}

export function IconPalette(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.4-1.2-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6h1.9a3.8 3.8 0 0 0 3.8-3.8c0-4.2-3.9-7.6-8.2-7.6Z" />
      <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconBell(props) {
  return (
    <Svg {...props}>
      <path d="M6 10.5a6 6 0 1 1 12 0c0 4 1.3 5.3 1.5 5.5H4.5C4.7 15.8 6 14.5 6 10.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Svg>
  )
}

export function IconSidebar(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M9.5 4.5v15" />
    </Svg>
  )
}

export function IconGoogle(props) {
  return (
    <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6H1.4a12 12 0 0 0 0 10.8l4-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A11.7 11.7 0 0 0 12 0 12 12 0 0 0 1.4 6.6l4 3.1c.9-2.8 3.5-4.9 6.6-4.9Z"
      />
    </svg>
  )
}

export function IconDiscord(props) {
  return (
    <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24">
      <path
        fill="#5865F2"
        d="M20.3 5.4A18.3 18.3 0 0 0 15.8 4c-.2.4-.5.9-.6 1.3a17 17 0 0 0-5 0A9 9 0 0 0 9.5 4a18.3 18.3 0 0 0-4.5 1.4C2 9.9 1.3 14.3 1.6 18.6a18.4 18.4 0 0 0 5.6 2.8c.5-.6.8-1.3 1.1-2a12 12 0 0 1-1.8-.9l.4-.3a13 13 0 0 0 10.2 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.6 1.4 1.1 2a18.3 18.3 0 0 0 5.6-2.8c.4-5-.9-9.4-2.1-13.2ZM8.9 15.9c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm6.2 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.9 2.2-1.9 2.2Z"
      />
    </svg>
  )
}

export function IconServer(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4" width="17" height="6.5" rx="1.5" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5" />
      <path d="M7 7.2h.01M7 16.7h.01" />
    </Svg>
  )
}

export function IconCamera(props) {
  return (
    <Svg {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8Z" />
      <circle cx="12" cy="13.5" r="3.6" />
    </Svg>
  )
}

export function IconHistory(props) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4.5h4.5" />
      <path d="M12 8v4.5l3 2" />
    </Svg>
  )
}

export function IconMonitor(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="1.8" />
      <path d="M8 20h8M12 16.5V20" />
    </Svg>
  )
}

export function IconKey(props) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12 19 4M16 7l2.5 2.5M13 10l2 2" />
    </Svg>
  )
}

export function IconCake(props) {
  return (
    <Svg {...props}>
      <path d="M4 20v-6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V20" />
      <path d="M4 16.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 3 0 2 .8 3 0" />
      <path d="M12 11.5V9" />
      <circle cx="12" cy="7.2" r="1.6" />
    </Svg>
  )
}

export function IconGender(props) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="14" r="5" />
      <path d="M13.6 10.4 20 4M15 4h5v5" />
    </Svg>
  )
}
