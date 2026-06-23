import './Callout.css'

export default function Callout({ type = 'tip', title, children }) {
  return (
    <div className={`callout callout-${type}`}>
      {title && <div className="callout-title">{title}</div>}
      <div className="callout-body">{children}</div>
    </div>
  )
}
