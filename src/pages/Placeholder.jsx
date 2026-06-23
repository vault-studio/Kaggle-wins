import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'

export default function Placeholder({ num, title }) {
  return (
    <article>
      <PageHeader num={num} title={title} />
      <Callout type="tip" title="Próximamente">
        <p>Esta sección todavía no tiene contenido. La iremos construyendo juntos, igual que la fase 1.</p>
      </Callout>
    </article>
  )
}
