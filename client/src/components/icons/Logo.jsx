export default function Logo({ size = 24, style, ...rest }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: 0, ...style }}
      {...rest}
    />
  )
}
