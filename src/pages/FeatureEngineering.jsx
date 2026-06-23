import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import FeatureEngGenerator from '../components/FeatureEngGenerator'

function AggregationSVG() {
  return (
    <svg viewBox="0 0 480 180" width="480">
      <text x="240" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Agregación por grupo: resume el historial de cada entidad
      </text>
      <text x="120" y="40" textAnchor="middle" fontSize="11" fill="var(--text)">filas individuales (user_id=7)</text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={40 + i * 60} y="50" width="50" height="26" rx="4" fill="var(--accent-bg)" stroke="var(--border)" />
      ))}
      <text x="65" y="67" textAnchor="middle" fontSize="10" fontFamily="var(--mono)">amount=12</text>
      <text x="125" y="67" textAnchor="middle" fontSize="10" fontFamily="var(--mono)">amount=8</text>
      <text x="185" y="67" textAnchor="middle" fontSize="10" fontFamily="var(--mono)">amount=20</text>

      <line x1="120" y1="80" x2="120" y2="105" stroke="var(--border)" />
      <text x="120" y="100" textAnchor="middle" fontSize="14" fill="var(--text)">↓ groupby + agg</text>

      <rect x="250" y="105" width="190" height="55" rx="8" fill="rgba(60,180,90,0.15)" stroke="var(--border)" />
      <text x="345" y="125" textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--text-h)">amount_mean = 13.3</text>
      <text x="345" y="142" textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--text-h)">amount_count = 3</text>
      <text x="345" y="90" textAnchor="middle" fontSize="11" fill="var(--text)">1 fila nueva por user_id, unida de vuelta al dataset</text>
    </svg>
  )
}

function TargetEncodingLeakageSVG() {
  return (
    <svg viewBox="0 0 500 180" width="500">
      <text x="250" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Target encoding: la forma fácil filtra información del target
      </text>

      <rect x="30" y="40" width="200" height="60" rx="8" fill="rgba(230,80,60,0.12)" stroke="#e03131" />
      <text x="130" y="62" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#e03131">❌ media del target</text>
      <text x="130" y="78" textAnchor="middle" fontSize="10.5" fill="var(--text)">calculada con TODO el train</text>
      <text x="130" y="92" textAnchor="middle" fontSize="10.5" fill="#e03131">→ leakage hacia validación</text>

      <rect x="270" y="40" width="200" height="60" rx="8" fill="rgba(60,180,90,0.15)" stroke="#2f9e44" />
      <text x="370" y="62" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#2f9e44">✓ media del target OOF</text>
      <text x="370" y="78" textAnchor="middle" fontSize="10.5" fill="var(--text)">calculada solo con el</text>
      <text x="370" y="92" textAnchor="middle" fontSize="10.5" fill="var(--text)">train de cada fold de CV</text>

      <text x="250" y="130" textAnchor="middle" fontSize="11" fill="var(--text)">
        Si codificas con todo el dataset antes de hacer CV, tu validación queda optimista de forma artificial.
      </text>
    </svg>
  )
}

function InteractionSVG() {
  return (
    <svg viewBox="0 0 460 130" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Interacciones: combinar columnas puede revelar señal que cada una sola no tiene
      </text>
      <rect x="40" y="40" width="100" height="40" rx="6" fill="var(--accent-bg)" stroke="var(--border)" />
      <text x="90" y="64" textAnchor="middle" fontSize="11" fontFamily="var(--mono)">price</text>
      <text x="160" y="64" textAnchor="middle" fontSize="16" fill="var(--text)">×</text>
      <rect x="180" y="40" width="100" height="40" rx="6" fill="var(--accent-bg)" stroke="var(--border)" />
      <text x="230" y="64" textAnchor="middle" fontSize="11" fontFamily="var(--mono)">quantity</text>
      <text x="300" y="64" textAnchor="middle" fontSize="16" fill="var(--text)">=</text>
      <rect x="320" y="40" width="110" height="40" rx="6" fill="rgba(60,180,90,0.18)" stroke="#2f9e44" />
      <text x="375" y="64" textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fontWeight="600">total_spent</text>
    </svg>
  )
}

export default function FeatureEngineering() {
  return (
    <article>
      <PageHeader
        num={5}
        title="Feature engineering"
        subtitle="Itera en ciclos cortos: crea una feature, valida en tu CV, decide si se queda."
      />

      <Callout type="tip" title="El ciclo de iteración">
        <p>
          Feature → validar en CV (fase 4) → ¿mejora el score? → si sí, commit; si no, descarta.
          No acumules features sin medir su impacto individualmente: con muchas a la vez no sabrás
          cuál ayudó y cuál solo añade ruido.
        </p>
      </Callout>

      <h2>1. Features de fecha</h2>
      <p>Una fecha en bruto no aporta mucho a un modelo. Descomponerla en año, mes, día de la semana o "es festivo/fin de semana" suele revelar patrones estacionales.</p>

      <h2>2. Agregaciones por grupo</h2>
      <p>Resumen el comportamiento histórico de una entidad (usuario, tienda, producto) en una sola fila que después se une de vuelta al dataset.</p>
      <Figure caption="Media, desviación, mínimo, máximo y conteo son los agregados más usados como punto de partida.">
        <AggregationSVG />
      </Figure>

      <h2>3. Interacciones entre variables</h2>
      <p>Multiplicar, dividir o restar columnas numéricas puede capturar relaciones que el modelo no encontraría por sí solo a partir de las columnas por separado.</p>
      <Figure caption="price × quantity solo tiene sentido como producto: por separado pierden la relación.">
        <InteractionSVG />
      </Figure>

      <h2>4. Target encoding — la trampa de leakage más común</h2>
      <p>
        Sustituir una categórica por la media del target para esa categoría es muy potente, pero si
        se calcula usando todo el dataset antes de separar en folds, cada fila "ve" su propio target
        indirectamente. El resultado: tu CV se ve mejor de lo que es en realidad.
      </p>
      <Figure caption="La solución es calcular la media solo con el train de cada fold (out-of-fold), igual que se hace con cualquier otro paso de preprocesado dentro de la CV.">
        <TargetEncodingLeakageSVG />
      </Figure>

      <Callout type="warn" title="Regla general anti-leakage">
        <p>
          Cualquier transformación que use el target (target encoding, agregaciones que incluyan el
          target, selección de features basada en correlación con el target) debe calcularse
          <strong> dentro</strong> de cada fold de tu validación cruzada, nunca antes de separarla.
        </p>
      </Callout>

      <h2>5. Transformaciones y binning</h2>
      <ul>
        <li><strong>Log transform:</strong> reduce el sesgo de variables con cola larga (ingresos, precios).</li>
        <li><strong>Binning:</strong> convierte una variable continua en categorías, útil cuando la relación con el target no es lineal.</li>
      </ul>

      <h2>Genera tu código de feature engineering</h2>
      <p>Activa las técnicas que quieras aplicar y ajusta los nombres de columnas. El código se combina en un único bloque listo para copiar.</p>
      <FeatureEngGenerator />

      <h2>Checklist antes de pasar a ensembling</h2>
      <ul>
        <li>☐ Cada feature nueva se validó individualmente en tu CV antes de quedarse.</li>
        <li>☐ Ninguna transformación que usa el target se calculó fuera del esquema de CV.</li>
        <li>☐ Tienes un registro (log) de qué features probaste y su efecto en el score.</li>
        <li>☐ El score de CV mejora de forma consistente, no solo en un fold puntual.</li>
      </ul>
    </article>
  )
}
