import './PageHeader.css'

export default function PageHeader({ num, title, subtitle }) {
  return (
    <header className="page-header">
      <div className="page-eyebrow">Fase {num} de 7</div>
      <h1>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  )
}
