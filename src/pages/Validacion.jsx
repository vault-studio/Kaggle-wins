import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import CVGenerator from '../components/CVGenerator'

function FoldRow({ y, highlightIdx, n, color = '#e03131', labels }) {
  const cellW = 360 / n
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <rect
          key={i}
          x={60 + i * cellW}
          y={y}
          width={cellW - 4}
          height="26"
          rx="4"
          fill={i === highlightIdx ? color : 'var(--accent-bg)'}
          stroke="var(--border)"
        />
      ))}
      {labels && (
        <text x="30" y={y + 18} fontSize="11" fill="var(--text)">{labels}</text>
      )}
    </g>
  )
}

function KFoldSVG() {
  return (
    <svg viewBox="0 0 460 170" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">KFold: la validación rota por bloques</text>
      {[0, 1, 2, 3].map((fold) => (
        <FoldRow key={fold} y={30 + fold * 34} n={5} highlightIdx={fold} labels={`fold ${fold}`} />
      ))}
      <text x="60" y="160" fontSize="10.5" fill="var(--text)">cada color = el bloque que se usa como validación en esa iteración</text>
    </svg>
  )
}

function StratifiedSVG() {
  return (
    <svg viewBox="0 0 460 150" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">StratifiedKFold: misma proporción de clases en cada fold</text>
      {[0, 1, 2].map((fold) => {
        const y = 32 + fold * 36
        return (
          <g key={fold}>
            <text x="20" y={y + 17} fontSize="10.5" fill="var(--text)">fold {fold}</text>
            <rect x="60" y={y} width="280" height="26" rx="4" fill="rgba(60,180,90,0.35)" stroke="var(--border)" />
            <rect x="340" y={y} width="80" height="26" rx="4" fill="rgba(230,80,60,0.45)" stroke="var(--border)" />
          </g>
        )
      })}
      <text x="200" y="142" textAnchor="middle" fontSize="10.5" fill="var(--text)">verde = clase mayoritaria · rojo = clase minoritaria, siempre en la misma proporción</text>
    </svg>
  )
}

function GroupKFoldSVG() {
  const groups = [
    { name: 'user_1', rows: 3, color: '#4263eb' },
    { name: 'user_2', rows: 2, color: '#2f9e44' },
    { name: 'user_3', rows: 4, color: '#e6a01e' },
    { name: 'user_4', rows: 2, color: '#aa3bff' },
  ]
  let x = 60
  const blocks = groups.map((g) => {
    const w = g.rows * 16
    const block = { ...g, x, w }
    x += w + 6
    return block
  })
  return (
    <svg viewBox="0 0 460 150" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">GroupKFold: un mismo grupo nunca queda partido entre folds</text>
      <text x="60" y="42" fontSize="10.5" fill="var(--text)">datos (cada bloque = filas de un mismo usuario)</text>
      {blocks.map((b) => (
        <rect key={b.name} x={b.x} y="50" width={b.w} height="24" fill={b.color} opacity="0.5" stroke="var(--border)" rx="3" />
      ))}
      <text x="60" y="100" fontSize="10.5" fill="var(--text)">fold de validación</text>
      <rect x={blocks[2].x} y="108" width={blocks[2].w} height="24" fill={blocks[2].color} opacity="0.8" stroke="var(--border)" rx="3" />
      <text x="230" y="142" textAnchor="middle" fontSize="10.5" fill="#e03131">user_3 entero va a validación, nunca se mezcla con train</text>
    </svg>
  )
}

function TimeSeriesSVG() {
  return (
    <svg viewBox="0 0 460 160" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">TimeSeriesSplit: validación siempre en el futuro respecto al train</text>
      {[0, 1, 2].map((fold) => {
        const y = 32 + fold * 36
        const trainW = 120 + fold * 80
        return (
          <g key={fold}>
            <text x="15" y={y + 17} fontSize="10.5" fill="var(--text)">fold {fold}</text>
            <rect x="60" y={y} width={trainW} height="24" fill="var(--accent-bg)" stroke="var(--border)" rx="3" />
            <rect x={60 + trainW + 6} y={y} width="60" height="24" fill="#e03131" opacity="0.6" stroke="var(--border)" rx="3" />
          </g>
        )
      })}
      <text x="230" y="148" textAnchor="middle" fontSize="10.5" fill="var(--text)">azul = train (pasado) · rojo = validación (futuro inmediato)</text>
    </svg>
  )
}

export default function Validacion() {
  return (
    <article>
      <PageHeader
        num={4}
        title="Validación robusta"
        subtitle="Si tu esquema de validación no imita el split real de Kaggle, todo lo que construyas después es ruido."
      />

      <Callout type="warn" title="Por qué es la fase más subestimada">
        <p>
          Puedes tener el mejor feature engineering del mundo, pero si tu CV no correlaciona con el
          leaderboard, no sabrás si una mejora es real o casualidad. Esta fase protege todo el trabajo
          de las fases 5 y 6.
        </p>
      </Callout>

      <h2>1. KFold — el caso por defecto</h2>
      <p>Divide los datos en K bloques; en cada iteración uno hace de validación y el resto de train. Vale cuando no hay estructura especial en los datos (sin grupos, sin orden temporal, clases razonablemente equilibradas).</p>
      <Figure caption="Cada fila pasa por validación exactamente una vez a lo largo de las K iteraciones.">
        <KFoldSVG />
      </Figure>

      <h2>2. StratifiedKFold — clasificación con clases desbalanceadas</h2>
      <p>Igual que KFold, pero garantiza que cada fold mantiene la misma proporción de clases que el dataset completo. Imprescindible si el target está desbalanceado (ej. 95%/5%).</p>
      <Figure caption="Sin estratificar, algún fold podría quedarse casi sin ejemplos de la clase minoritaria.">
        <StratifiedSVG />
      </Figure>

      <h2>3. GroupKFold — cuando hay filas relacionadas</h2>
      <p>Si varias filas pertenecen a la misma entidad (mismo usuario, paciente, tienda...), nunca deben repartirse entre train y validación: eso sería leakage encubierto, porque el modelo "ya conoce" a esa entidad.</p>
      <Figure caption="Todas las filas de un mismo grupo van juntas al mismo lado (train o validación).">
        <GroupKFoldSVG />
      </Figure>

      <h2>4. TimeSeriesSplit — series temporales</h2>
      <p>El train siempre debe ser anterior en el tiempo al bloque de validación. Mezclar datos del futuro en el train de una serie temporal es una de las formas más comunes de leakage.</p>
      <Figure caption="La ventana de entrenamiento crece, pero la validación siempre apunta a un periodo posterior.">
        <TimeSeriesSVG />
      </Figure>

      <Callout type="tip" title="Regla para elegir el esquema">
        <p>
          Pregúntate: ¿cómo separó Kaggle exactamente train y test en esta competición? Si fue por
          tiempo, usa TimeSeriesSplit. Si fue por usuario/entidad, usa GroupKFold. Si fue aleatorio
          y las clases están desbalanceadas, usa StratifiedKFold. Tu esquema de validación debe
          replicar esa lógica, no ser solo "lo más fácil de programar".
        </p>
      </Callout>

      <h2>Genera tu código de validación cruzada</h2>
      <p>
        Elige el esquema según la estructura de tus datos, el modelo y la métrica. El código genera
        predicciones out-of-fold (<code>oof_preds</code>), que además te servirán más adelante para
        el ensembling de la fase 6.
      </p>
      <CVGenerator />

      <h2>Checklist antes de pasar a feature engineering</h2>
      <ul>
        <li>☐ El esquema de CV elegido refleja cómo Kaggle separó train y test.</li>
        <li>☐ El score medio de CV es razonablemente estable entre folds (std bajo).</li>
        <li>☐ El score de CV está en línea con el del leaderboard público.</li>
        <li>☐ Tienes guardadas las predicciones out-of-fold para usarlas después.</li>
      </ul>
    </article>
  )
}
