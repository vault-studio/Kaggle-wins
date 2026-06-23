import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import BaselineGenerator from '../components/BaselineGenerator'

function PipelineSVG() {
  const steps = ['Cargar datos', 'Split train/val', 'Entrenar modelo simple', 'Predecir', 'Generar submission.csv', 'Submit a Kaggle']
  return (
    <svg viewBox="0 0 700 120" width="700">
      {steps.map((s, i) => {
        const x = 10 + i * 116
        return (
          <g key={s}>
            <rect x={x} y="30" width="100" height="60" rx="9" fill={i === steps.length - 1 ? 'var(--accent)' : 'var(--accent-bg)'} stroke="var(--accent-border)" />
            <text
              x={x + 50}
              y="64"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={i === steps.length - 1 ? 'white' : 'var(--text-h)'}
            >
              {s.split(' ').map((w, j) => (
                <tspan key={j} x={x + 50} dy={j === 0 ? 0 : 12}>{w}</tspan>
              ))}
            </text>
            {i < steps.length - 1 && (
              <text x={x + 108} y="64" fontSize="16" fill="var(--text)">→</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function EarlySubmitSVG() {
  return (
    <svg viewBox="0 0 480 160" width="480">
      <text x="240" y="18" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        ¿Tu CV local corresponde con el leaderboard?
      </text>
      <line x1="50" y1="130" x2="430" y2="130" stroke="var(--border)" />
      <line x1="50" y1="130" x2="50" y2="40" stroke="var(--border)" />
      <text x="240" y="150" textAnchor="middle" fontSize="11" fill="var(--text)">score CV local</text>
      <text x="25" y="85" textAnchor="middle" fontSize="11" fill="var(--text)" transform="rotate(-90 25 85)">score LB público</text>
      <line x1="60" y1="120" x2="410" y2="50" stroke="var(--border)" strokeDasharray="4 4" />
      {[[90, 105], [150, 90], [210, 75], [280, 60], [350, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="var(--accent)" />
      ))}
      <text x="350" y="40" fontSize="11" fill="#2f9e44" fontWeight="600">correlación buena</text>
    </svg>
  )
}

export default function Baseline() {
  return (
    <article>
      <PageHeader
        num={3}
        title="Baseline rápido"
        subtitle="Objetivo: tener un pipeline completo funcionando hoy, no el mejor modelo posible."
      />

      <Callout type="tip" title="La idea clave">
        <p>
          Un baseline no busca ganar la competición. Busca validar que tu pipeline completo
          (datos → modelo → predicción → submission) funciona de punta a punta, y que tu
          validación local se parece a lo que ves en el leaderboard.
        </p>
      </Callout>

      <h2>1. El pipeline mínimo</h2>
      <p>Antes de optimizar nada, monta estos seis pasos y consigue que funcionen sin errores:</p>
      <Figure caption="Cada flecha es un punto donde algo puede romperse (formatos, columnas, tipos). Mejor descubrirlo ahora que en el día 20.">
        <PipelineSVG />
      </Figure>

      <h2>2. Por qué empezar simple</h2>
      <ul>
        <li><strong>LightGBM/XGBoost</strong> para tabular: manejan bien nulos y categóricas sin mucho preprocesado, y son difíciles de superar como punto de partida.</li>
        <li>Para imagen/texto, usa una arquitectura pretrained estándar (ResNet, BERT...) sin fine-tuning agresivo todavía.</li>
        <li>No hagas feature engineering en esta fase — eso viene después, una vez confirmes que el pipeline básico funciona.</li>
      </ul>

      <h2>3. Haz un submit temprano</h2>
      <p>
        Sube tu primera predicción (aunque sea mediocre) en cuanto tengas el pipeline funcionando.
        El objetivo es comparar tu score de validación local contra el del leaderboard público.
      </p>
      <Figure caption="Si los puntos siguen la diagonal, tu esquema de validación es de fiar. Si no, hay un problema de fondo (leakage, split mal hecho, distribución distinta) que hay que resolver antes de seguir iterando.">
        <EarlySubmitSVG />
      </Figure>
      <Callout type="warn" title="Si CV local y leaderboard no correlacionan">
        <p>
          No sigas iterando features todavía. Revisa primero tu esquema de validación (fase 4):
          es probable que tu split no imite bien cómo Kaggle separó train y test.
        </p>
      </Callout>

      <h2>Genera tu código de baseline</h2>
      <p>
        Elige el tipo de problema, el modelo y la métrica, y ajusta los nombres de archivo y
        columnas. El código incluye split train/val, entrenamiento, validación, reentrenamiento
        con todo el train y generación de <code>submission.csv</code>.
      </p>
      <BaselineGenerator />

      <h2>Checklist antes de pasar a validación robusta</h2>
      <ul>
        <li>☐ El pipeline corre de principio a fin sin errores.</li>
        <li>☐ Has hecho al menos un submit y visto tu posición en el leaderboard público.</li>
        <li>☐ Tu score de validación local es del orden del score del leaderboard (no exacto, pero coherente).</li>
        <li>☐ Tienes un número de referencia (baseline score) para medir si las siguientes mejoras realmente ayudan.</li>
      </ul>
    </article>
  )
}
