import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'

function MissingValuesSVG() {
  const cols = [
    { name: 'age', pct: 4 },
    { name: 'income', pct: 38 },
    { name: 'city', pct: 12 },
    { name: 'last_login', pct: 71 },
    { name: 'plan', pct: 0 },
    { name: 'score', pct: 22 },
  ]
  const barW = 60
  return (
    <svg viewBox="0 0 480 220" width="480">
      <text x="240" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        % de valores nulos por columna
      </text>
      <line x1="40" y1="180" x2="460" y2="180" stroke="var(--border)" />
      {cols.map((c, i) => {
        const x = 50 + i * (barW + 10)
        const h = c.pct * 1.4
        const color = c.pct > 50 ? '#e03131' : c.pct > 15 ? '#e6a01e' : '#2f9e44'
        return (
          <g key={c.name}>
            <rect x={x} y={180 - h} width={barW} height={h} fill={color} opacity="0.75" rx="3" />
            <text x={x + barW / 2} y={180 - h - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-h)">{c.pct}%</text>
            <text x={x + barW / 2} y="198" textAnchor="middle" fontSize="11" fill="var(--text)" fontFamily="var(--mono)">{c.name}</text>
          </g>
        )
      })}
    </svg>
  )
}

function TargetSkewSVG() {
  const bars = [2, 5, 12, 28, 45, 30, 16, 8, 4, 2, 1, 14]
  const maxV = Math.max(...bars)
  return (
    <svg viewBox="0 0 460 200" width="460">
      <text x="230" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Distribución del target: una clase rara aparte indica desbalanceo
      </text>
      <line x1="30" y1="160" x2="440" y2="160" stroke="var(--border)" />
      {bars.map((v, i) => {
        const x = 40 + i * 33
        const h = (v / maxV) * 110
        const isOutlierBin = i === bars.length - 1
        return (
          <rect
            key={i}
            x={x}
            y={160 - h}
            width="26"
            height={h}
            fill={isOutlierBin ? '#e03131' : 'var(--accent)'}
            opacity={isOutlierBin ? 0.85 : 0.55}
            rx="2"
          />
        )
      })}
      <text x="420" y="50" textAnchor="middle" fontSize="11" fill="#e03131" fontWeight="600">clase rara</text>
    </svg>
  )
}

function AdversarialValidationSVG() {
  return (
    <svg viewBox="0 0 540 220" width="540">
      <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Adversarial validation: ¿se puede distinguir train de test?
      </text>

      <rect x="40" y="40" width="180" height="60" rx="8" fill="var(--accent-bg)" stroke="var(--accent-border)" />
      <text x="130" y="75" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">train + test</text>

      <text x="240" y="75" textAnchor="middle" fontSize="20" fill="var(--text)">→</text>

      <rect x="270" y="40" width="220" height="60" rx="8" fill="var(--code-bg)" stroke="var(--border)" />
      <text x="380" y="65" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-h)">clasificador binario</text>
      <text x="380" y="82" textAnchor="middle" fontSize="11" fill="var(--text)" fontFamily="var(--mono)">label = ¿es de test?</text>

      <line x1="130" y1="100" x2="130" y2="130" stroke="var(--border)" />
      <line x1="380" y1="100" x2="380" y2="130" stroke="var(--border)" />
      <line x1="130" y1="130" x2="380" y2="130" stroke="var(--border)" />
      <line x1="255" y1="130" x2="255" y2="150" stroke="var(--border)" />

      <rect x="60" y="155" width="180" height="50" rx="8" fill="rgba(60,180,90,0.15)" stroke="var(--border)" />
      <text x="150" y="176" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#2f9e44">AUC ≈ 0.5</text>
      <text x="150" y="192" textAnchor="middle" fontSize="10.5" fill="var(--text)">distribuciones parecidas, bien</text>

      <rect x="280" y="155" width="200" height="50" rx="8" fill="rgba(230,80,60,0.12)" stroke="var(--border)" />
      <text x="380" y="176" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#e03131">AUC ≈ 0.9+</text>
      <text x="380" y="192" textAnchor="middle" fontSize="10.5" fill="var(--text)">train/test difieren, cuidado</text>
    </svg>
  )
}

function LeakageSVG() {
  return (
    <svg viewBox="0 0 500 170" width="500">
      <text x="250" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Leakage: una columna que "sabe" el futuro o el target
      </text>
      <rect x="40" y="40" width="420" height="36" rx="6" fill="var(--code-bg)" stroke="var(--border)" />
      <text x="60" y="63" fontSize="12" fontFamily="var(--mono)" fill="var(--text)">id, age, city, signup_date,</text>
      <rect x="300" y="42" width="150" height="32" rx="5" fill="rgba(230,80,60,0.18)" stroke="#e03131" />
      <text x="375" y="63" fontSize="12" fontFamily="var(--mono)" fontWeight="700" fill="#e03131">cancelled_after</text>

      <line x1="375" y1="78" x2="375" y2="110" stroke="#e03131" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#e03131" />
        </marker>
      </defs>
      <text x="375" y="130" textAnchor="middle" fontSize="11" fill="#e03131" fontWeight="600">
        solo existe si el cliente ya canceló
      </text>
      <text x="375" y="146" textAnchor="middle" fontSize="11" fill="#e03131">
        → casi es el target disfrazado
      </text>
    </svg>
  )
}

export default function EDA() {
  return (
    <article>
      <PageHeader
        num={2}
        title="Exploración (EDA)"
        subtitle="Antes de entrenar nada, hay que conocer los datos: qué hay, qué falta, y si algo huele mal."
      />

      <Callout type="tip" title="Objetivo de esta fase">
        <p>
          No es buscar el mejor modelo todavía. Es entender la forma de los datos, detectar
          problemas (nulos, leakage, desbalanceo) y confirmar que train y test son comparables.
        </p>
      </Callout>

      <h2>1. Carga y primer vistazo</h2>
      <ul>
        <li>Tipos de cada columna (numérica, categórica, fecha, texto libre).</li>
        <li><code>shape</code>, memoria que ocupa, duplicados.</li>
        <li>Estadísticos básicos (<code>describe()</code>) para detectar valores imposibles (edad -1, precios negativos...).</li>
      </ul>

      <h2>2. Valores nulos</h2>
      <p>No todos los nulos se tratan igual: un 4% de nulos es ruido, un 70% puede significar que la columna casi no aporta o que el nulo en sí es informativo.</p>
      <Figure caption="Columnas con muchos nulos (rojo) necesitan una decisión explícita: imputar, crear un flag 'es_nulo', o descartar.">
        <MissingValuesSVG />
      </Figure>

      <h2>3. Distribución del target</h2>
      <p>Mira si el target está balanceado, sesgado, o tiene una cola larga. Esto condiciona tu métrica de validación y si necesitas técnicas de desbalanceo.</p>
      <Figure caption="Una clase o rango muy minoritario suele necesitar tratamiento especial (resampling, class weights, métricas robustas).">
        <TargetSkewSVG />
      </Figure>

      <h2>4. ¿Train y test se parecen? (Adversarial validation)</h2>
      <p>
        Entrena un clasificador binario cuyo único objetivo es predecir si una fila viene de train
        o de test. Si lo consigue con buen AUC, hay una diferencia sistemática entre ambos conjuntos
        que tu modelo debería tener en cuenta (o que invalida tu esquema de validación).
      </p>
      <Figure caption="Un AUC alto en este test significa que train y test no son intercambiables: cuidado con cómo validas localmente.">
        <AdversarialValidationSVG />
      </Figure>

      <h2>5. Busca leakage</h2>
      <p>
        Leakage es cuando una columna contiene información que en producción no estaría disponible
        en el momento de predecir, normalmente porque deriva del propio target o del futuro.
      </p>
      <Figure caption="Si una columna solo tiene valor cuando ya ocurrió el evento que quieres predecir, es leakage.">
        <LeakageSVG />
      </Figure>
      <Callout type="warn" title="Señales de alerta de leakage">
        <ul>
          <li>Una sola columna que por sí sola da un score de validación sospechosamente alto.</li>
          <li>Columnas con fecha posterior al momento de predicción.</li>
          <li>IDs o columnas agregadas que se calcularon usando todo el dataset (incluyendo test).</li>
        </ul>
      </Callout>

      <h2>6. Lee lo que ya descubrieron otros</h2>
      <p>
        Antes de perder horas redescubriendo algo, revisa los Notebooks y Discussions más votados.
        En casi toda competición alguien ya documentó columnas raras, leakage conocido o trucos del dataset.
      </p>

      <h2>Checklist antes de pasar al baseline</h2>
      <ul>
        <li>☐ Conozco los tipos y el significado de cada columna relevante.</li>
        <li>☐ Sé dónde están los nulos y tengo un plan para cada caso.</li>
        <li>☐ Conozco la distribución del target y si está desbalanceado.</li>
        <li>☐ He comprobado que train y test son razonablemente comparables.</li>
        <li>☐ No he encontrado (o ya he resuelto) columnas con leakage evidente.</li>
      </ul>
    </article>
  )
}
