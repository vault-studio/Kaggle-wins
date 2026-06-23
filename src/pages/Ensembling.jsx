import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import EnsembleGenerator from '../components/EnsembleGenerator'

function BlendingSVG() {
  return (
    <svg viewBox="0 0 480 160" width="480">
      <text x="240" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Blending: promedio (simple o ponderado) de varias predicciones
      </text>
      {['LightGBM', 'XGBoost', 'Red neuronal'].map((label, i) => (
        <g key={label}>
          <rect x="40" y={36 + i * 32} width="140" height="24" rx="5" fill="var(--accent-bg)" stroke="var(--border)" />
          <text x="110" y={52 + i * 32} textAnchor="middle" fontSize="11" fill="var(--text-h)">{label}</text>
        </g>
      ))}
      <line x1="180" y1="48" x2="280" y2="78" stroke="var(--border)" />
      <line x1="180" y1="80" x2="280" y2="80" stroke="var(--border)" />
      <line x1="180" y1="112" x2="280" y2="82" stroke="var(--border)" />
      <circle cx="290" cy="80" r="14" fill="var(--accent)" />
      <text x="290" y="84" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">Σ</text>
      <rect x="330" y="62" width="120" height="36" rx="6" fill="rgba(60,180,90,0.18)" stroke="#2f9e44" />
      <text x="390" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-h)">predicción final</text>
    </svg>
  )
}

function StackingSVG() {
  return (
    <svg viewBox="0 0 480 190" width="480">
      <text x="240" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Stacking: un meta-modelo aprende a ponderar cada modelo base
      </text>
      {['LightGBM', 'XGBoost', 'Red neuronal'].map((label, i) => (
        <g key={label}>
          <rect x="20" y={40 + i * 32} width="130" height="24" rx="5" fill="var(--accent-bg)" stroke="var(--border)" />
          <text x="85" y={56 + i * 32} textAnchor="middle" fontSize="11" fill="var(--text-h)">{label}</text>
          <text x="170" y={56 + i * 32} fontSize="10" fill="var(--text)">oof_pred_{i}</text>
        </g>
      ))}
      <line x1="150" y1="52" x2="260" y2="90" stroke="var(--border)" />
      <line x1="150" y1="84" x2="260" y2="92" stroke="var(--border)" />
      <line x1="150" y1="116" x2="260" y2="94" stroke="var(--border)" />
      <rect x="260" y="70" width="160" height="50" rx="8" fill="rgba(170,59,255,0.18)" stroke="var(--accent-border)" />
      <text x="340" y="91" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-h)">meta-modelo</text>
      <text x="340" y="106" textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="var(--text)">LogisticRegression / Ridge</text>
      <text x="240" y="160" textAnchor="middle" fontSize="10.5" fill="var(--text)">
        Entrena con las predicciones out-of-fold (fase 4) como input, nunca con predicciones "vistas" durante el entrenamiento.
      </text>
    </svg>
  )
}

function DiversitySVG() {
  return (
    <svg viewBox="0 0 460 150" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        La diversidad importa más que el score individual
      </text>
      <circle cx="120" cy="80" r="45" fill="rgba(60,180,90,0.18)" stroke="#2f9e44" />
      <circle cx="170" cy="80" r="45" fill="rgba(66,99,235,0.18)" stroke="#4263eb" />
      <text x="100" y="84" fontSize="11" fill="var(--text-h)">modelo A</text>
      <text x="180" y="84" fontSize="11" fill="var(--text-h)">modelo B</text>
      <text x="145" y="60" textAnchor="middle" fontSize="10" fill="var(--text)">errores</text>
      <text x="145" y="72" textAnchor="middle" fontSize="10" fill="var(--text)">compartidos</text>

      <text x="330" y="60" textAnchor="middle" fontSize="11" fill="var(--text)">vs.</text>
      <circle cx="290" cy="90" r="40" fill="rgba(60,180,90,0.18)" stroke="#2f9e44" />
      <circle cx="380" cy="90" r="40" fill="rgba(230,80,60,0.15)" stroke="#e03131" />
      <text x="275" y="94" fontSize="10.5" fill="var(--text-h)">modelo A</text>
      <text x="365" y="94" fontSize="10.5" fill="var(--text-h)">modelo C</text>
      <text x="335" y="130" textAnchor="middle" fontSize="10" fill="#2f9e44">poco solapamiento → al combinar, los errores de uno los corrige el otro</text>
    </svg>
  )
}

export default function Ensembling() {
  return (
    <article>
      <PageHeader
        num={6}
        title="Ensembling / stacking"
        subtitle="Combinar modelos distintos suele dar el último salto de posiciones en el leaderboard."
      />

      <Callout type="tip" title="La clave no es tener el mejor modelo individual">
        <p>
          Es tener varios modelos que se equivocan en cosas distintas. Un LightGBM y un XGBoost con
          hiperparámetros parecidos aportan poca diversidad; un modelo lineal o una red neuronal
          junto a un GBM suele aportar más al combinar.
        </p>
      </Callout>

      <h2>1. Blending — promediar predicciones</h2>
      <p>La forma más simple: promedio simple o ponderado de las predicciones de varios modelos ya entrenados.</p>
      <Figure caption="El peso de cada modelo en el promedio ponderado normalmente se ajusta según su score individual en CV.">
        <BlendingSVG />
      </Figure>

      <h2>2. Stacking — un meta-modelo aprende los pesos</h2>
      <p>
        En lugar de fijar los pesos a mano, entrenas un modelo simple (regresión logística o Ridge)
        que recibe las predicciones de los modelos base como features y aprende a combinarlas.
      </p>
      <Figure caption="Crítico: el meta-modelo se entrena con las predicciones out-of-fold (de la fase 4), no con predicciones del propio train, o habría leakage.">
        <StackingSVG />
      </Figure>

      <h2>3. Diversidad por encima de todo</h2>
      <p>Dos modelos casi idénticos en sus errores no aportan nada al combinarlos. Busca diversidad real: distintas familias de modelos, distintos subconjuntos de features, o distintas semillas con suficiente variabilidad.</p>
      <Figure caption="Cuando los modelos fallan en cosas distintas, el ensemble corrige los errores de unos con los aciertos de otros.">
        <DiversitySVG />
      </Figure>

      <Callout type="warn" title="Cuidado con">
        <ul>
          <li>Hacer stacking sin usar predicciones out-of-fold (leakage garantizado).</li>
          <li>Combinar demasiados modelos casi idénticos: añade complejidad sin mejorar el score.</li>
          <li>Sobreajustar los pesos del blending al leaderboard público con pocas muestras.</li>
        </ul>
      </Callout>

      <h2>Genera tu código de ensemble</h2>
      <p>
        Añade los modelos que quieras combinar (usando sus predicciones out-of-fold y de test ya
        guardadas), elige el método y genera el código.
      </p>
      <EnsembleGenerator />

      <h2>Checklist antes de las submissions finales</h2>
      <ul>
        <li>☐ El ensemble mejora el score de CV respecto al mejor modelo individual.</li>
        <li>☐ Si usas stacking, el meta-modelo se entrenó con predicciones out-of-fold.</li>
        <li>☐ Los modelos combinados tienen diversidad real (no son variaciones triviales del mismo modelo).</li>
      </ul>
    </article>
  )
}
