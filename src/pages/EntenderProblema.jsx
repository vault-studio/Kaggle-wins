import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import MetricGlossary from '../components/MetricGlossary'

function ConfusionMatrixSVG() {
  return (
    <svg viewBox="0 0 520 280" width="520">
      <text x="260" y="20" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Matriz de confusión → de dónde salen Precision, Recall, F1
      </text>

      {/* Axis labels */}
      <text x="170" y="48" textAnchor="middle" fontSize="11" fill="var(--text)">Predicho: Positivo</text>
      <text x="320" y="48" textAnchor="middle" fontSize="11" fill="var(--text)">Predicho: Negativo</text>
      <text x="60" y="110" textAnchor="middle" fontSize="11" fill="var(--text)" transform="rotate(-90 60 110)">Real: Positivo</text>
      <text x="60" y="210" textAnchor="middle" fontSize="11" fill="var(--text)" transform="rotate(-90 60 210)">Real: Negativo</text>

      {/* TP */}
      <rect x="90" y="60" width="160" height="90" fill="rgba(60,180,90,0.18)" stroke="var(--border)" rx="6" />
      <text x="170" y="100" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2f9e44">TP</text>
      <text x="170" y="120" textAnchor="middle" fontSize="11" fill="var(--text)">verdadero positivo</text>

      {/* FN */}
      <rect x="250" y="60" width="160" height="90" fill="rgba(230,80,60,0.15)" stroke="var(--border)" rx="6" />
      <text x="330" y="100" textAnchor="middle" fontSize="20" fontWeight="700" fill="#e03131">FN</text>
      <text x="330" y="120" textAnchor="middle" fontSize="11" fill="var(--text)">falso negativo</text>

      {/* FP */}
      <rect x="90" y="150" width="160" height="90" fill="rgba(230,80,60,0.15)" stroke="var(--border)" rx="6" />
      <text x="170" y="190" textAnchor="middle" fontSize="20" fontWeight="700" fill="#e03131">FP</text>
      <text x="170" y="210" textAnchor="middle" fontSize="11" fill="var(--text)">falso positivo</text>

      {/* TN */}
      <rect x="250" y="150" width="160" height="90" fill="rgba(60,180,90,0.18)" stroke="var(--border)" rx="6" />
      <text x="330" y="190" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2f9e44">TN</text>
      <text x="330" y="210" textAnchor="middle" fontSize="11" fill="var(--text)">verdadero negativo</text>

      <text x="440" y="95" fontSize="12" fill="var(--text-h)" fontFamily="var(--mono)">Precision =</text>
      <text x="440" y="110" fontSize="12" fill="var(--text)" fontFamily="var(--mono)">TP/(TP+FP)</text>
      <text x="440" y="135" fontSize="12" fill="var(--text-h)" fontFamily="var(--mono)">Recall =</text>
      <text x="440" y="150" fontSize="12" fill="var(--text)" fontFamily="var(--mono)">TP/(TP+FN)</text>
      <text x="440" y="175" fontSize="12" fill="var(--text-h)" fontFamily="var(--mono)">F1 = 2PR/</text>
      <text x="440" y="190" fontSize="12" fill="var(--text)" fontFamily="var(--mono)">(P+R)</text>
    </svg>
  )
}

function RMSEvsMAESVG() {
  // points scattered around a diagonal, with residual lines emphasized
  const points = [
    [60, 210], [100, 190], [140, 150], [180, 160], [220, 110],
    [260, 100], [300, 60], [340, 80], [380, 40],
  ]
  return (
    <svg viewBox="0 0 460 260" width="460">
      <text x="230" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        RMSE penaliza más los errores grandes que MAE
      </text>
      <line x1="50" y1="230" x2="420" y2="230" stroke="var(--border)" />
      <line x1="50" y1="230" x2="50" y2="30" stroke="var(--border)" />
      <text x="235" y="252" textAnchor="middle" fontSize="11" fill="var(--text)">predicción</text>
      <text x="20" y="130" textAnchor="middle" fontSize="11" fill="var(--text)" transform="rotate(-90 20 130)">real</text>
      <line x1="60" y1="220" x2="400" y2="40" stroke="var(--accent)" strokeDasharray="4 4" strokeWidth="1.5" />
      {points.map(([x, y], i) => {
        const idealY = 220 - ((x - 60) / (400 - 60)) * (220 - 40)
        const isOutlier = i === 8
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={idealY} stroke={isOutlier ? '#e03131' : 'var(--text)'} strokeWidth={isOutlier ? 2 : 1} opacity={isOutlier ? 0.9 : 0.4} />
            <circle cx={x} cy={y} r={isOutlier ? 6 : 4} fill={isOutlier ? '#e03131' : 'var(--accent)'} />
          </g>
        )
      })}
      <text x="370" y="55" fontSize="11" fill="#e03131" fontWeight="600">1 outlier grande</text>
      <text x="370" y="68" fontSize="11" fill="#e03131">→ dispara el RMSE</text>
    </svg>
  )
}

function ProblemTypesSVG() {
  const types = [
    { label: 'Tabular', metric: 'RMSE / AUC', x: 30 },
    { label: 'Imagen (CV)', metric: 'IoU / Accuracy', x: 215 },
    { label: 'Texto (NLP)', metric: 'F1 / LogLoss', x: 400 },
    { label: 'Series temporales', metric: 'SMAPE / WRMSSE', x: 585 },
  ]
  return (
    <svg viewBox="0 0 700 150" width="700">
      {types.map((t) => (
        <g key={t.label}>
          <rect x={t.x} y="20" width="150" height="90" rx="10" fill="var(--accent-bg)" stroke="var(--accent-border)" />
          <text x={t.x + 75} y="58" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="var(--text-h)">{t.label}</text>
          <text x={t.x + 75} y="82" textAnchor="middle" fontSize="11" fill="var(--text)" fontFamily="var(--mono)">{t.metric}</text>
        </g>
      ))}
    </svg>
  )
}

function SubmissionAnatomySVG() {
  return (
    <svg viewBox="0 0 480 200" width="480">
      <text x="240" y="20" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        submission.csv tiene que calzar exacto con sample_submission.csv
      </text>
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x="60" y={40 + row * 32} width="160" height="28" fill={row === 0 ? 'var(--accent-bg)' : 'var(--code-bg)'} stroke="var(--border)" />
          <rect x="220" y={40 + row * 32} width="160" height="28" fill={row === 0 ? 'var(--accent-bg)' : 'var(--code-bg)'} stroke="var(--border)" />
          <text x="140" y={58 + row * 32} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill={row === 0 ? 'var(--accent)' : 'var(--text)'}>
            {row === 0 ? 'id' : `row_${row}`}
          </text>
          <text x="300" y={58 + row * 32} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill={row === 0 ? 'var(--accent)' : 'var(--text)'}>
            {row === 0 ? 'target' : (0.12 * row).toFixed(2)}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function EntenderProblema() {
  return (
    <article>
      <PageHeader
        num={1}
        title="Entender el problema"
        subtitle="Antes de escribir una línea de código, hay que saber exactamente qué te van a pedir y cómo te van a puntuar."
      />

      <Callout type="warn" title="Por qué esto es lo primero">
        <p>
          La mayoría de errores caros en una competición (elegir mal la métrica de validación,
          hacer leakage, optimizar lo que no toca) vienen de saltarse esta fase. 30-60 minutos
          aquí ahorran días de trabajo mal dirigido.
        </p>
      </Callout>

      <h2>1. Lee las cuatro secciones clave</h2>
      <p>No solo el resumen de la home. En cada competición de Kaggle hay cuatro pestañas que debes leer completas:</p>
      <ul>
        <li><strong>Overview</strong> — contexto del problema, qué se está prediciendo y por qué.</li>
        <li><strong>Data</strong> — qué ficheros hay, qué representa cada columna, si hay datos externos permitidos.</li>
        <li><strong>Evaluation</strong> — la métrica exacta y el formato de submission.</li>
        <li><strong>Rules</strong> — límites de submissions diarias, equipos, uso de datos externos o de otros modelos pretrained.</li>
      </ul>

      <h2>2. Identifica la métrica exacta</h2>
      <p>
        La métrica determina qué vale la pena optimizar. Dos modelos pueden tener el mismo "accuracy"
        y comportarse muy distinto en F1 si las clases están desbalanceadas.
      </p>
      <Figure caption="Precision, Recall y F1 se calculan directamente de los 4 cuadrantes de la matriz de confusión.">
        <ConfusionMatrixSVG />
      </Figure>
      <p>Para problemas de regresión, la elección entre RMSE y MAE cambia cómo se comporta tu modelo frente a outliers:</p>
      <Figure caption="RMSE eleva al cuadrado el error, así que un solo punto muy alejado pesa más que muchos errores pequeños. MAE trata todos los errores por igual.">
        <RMSEvsMAESVG />
      </Figure>
      <Callout type="tip" title="Regla práctica">
        <p>
          Si la métrica de la competición es RMSE, tu modelo se va a obsesionar con los outliers.
          Si es MAE o MAPE, los outliers pesan menos. Esto debería influir en cómo tratas valores
          extremos en el preprocesado.
        </p>
      </Callout>

      <h2>3. Identifica el tipo de problema</h2>
      <p>El tipo de datos condiciona qué modelos, librerías y métricas son razonables de entrada:</p>
      <Figure caption="Cada familia de problema trae consigo sus métricas y arquitecturas habituales.">
        <ProblemTypesSVG />
      </Figure>

      <h2>Glosario rápido de métricas por tipo de problema</h2>
      <p>
        No hace falta dominarlas todas: solo identifica en qué categoría cae tu competición
        y revisa la definición de la métrica que estés usando.
      </p>
      <MetricGlossary />

      <h2>4. Revisa tamaño de datos, datos externos y formato de envío</h2>
      <ul>
        <li><strong>Tamaño:</strong> ¿caben los datos en RAM? ¿necesitas procesar por chunks o usar GPU?</li>
        <li><strong>Datos externos:</strong> ¿están permitidos pretrained models o datasets externos? Algunas competiciones lo prohíben explícitamente.</li>
        <li><strong>Formato de submission:</strong> columnas exactas, orden de filas, tipo de dato (probabilidad vs. clase).</li>
      </ul>
      <Figure caption="Tu submission.csv debe tener exactamente las mismas columnas, nombres y filas que sample_submission.csv.">
        <SubmissionAnatomySVG />
      </Figure>

      <Callout type="warn" title="Error común">
        <p>
          Enviar probabilidades cuando se espera la clase (o viceversa), o desordenar las filas
          respecto al <code>id</code> esperado. Siempre valida tu submission contra el
          <code> sample_submission.csv</code> antes de subirla.
        </p>
      </Callout>

      <h2>Checklist antes de pasar a EDA</h2>
      <ul>
        <li>☐ Sé exactamente qué métrica se usa y cómo se calcula.</li>
        <li>☐ Sé qué tipo de problema es (tabular, imagen, texto, series temporales...).</li>
        <li>☐ Sé si puedo usar datos o modelos externos.</li>
        <li>☐ Sé el formato exacto de <code>submission.csv</code>.</li>
        <li>☐ He leído los Notebooks/Discussions más votados para detectar trampas conocidas.</li>
      </ul>
    </article>
  )
}
