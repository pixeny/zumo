export default function Logo({ size = 24, style, ...rest }) {
  // In the main app, "/logo.png" resolves against the app's own origin — correct.
  // In the standalone widget bundle embedded on someone else's site, a root-relative
  // path resolves against THAT site's origin instead and 404s. widget-entry.jsx sets
  // this global to the widget's own origin so the logo still resolves there.
  const base =
    typeof window !== 'undefined' && window.__ZUMO_WIDGET_ORIGIN__
      ? window.__ZUMO_WIDGET_ORIGIN__
      : ''
  return (
    <img
      src={`${base}/logo.png`}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: 0, ...style }}
      {...rest}
    />
  )
}
