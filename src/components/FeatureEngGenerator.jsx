import { useMemo, useState } from 'react'
import { generateFeatureEngCode } from '../utils/featureEngCodeGen'
import './AutoEDA.css'
import './BaselineGenerator.css'
import './FeatureEngGenerator.css'

const TECHNIQUES = [
  { key: 'dateFeatures', label: 'Features de fecha', desc: 'año, mes, día, día de la semana, fin de semana' },
  { key: 'aggregations', label: 'Agregaciones por grupo', desc: 'media/std/min/max/count de una columna numérica por grupo' },
  { key: 'interactions', label: 'Interacciones', desc: 'producto, división y resta entre dos columnas numéricas' },
  { key: 'logTransform', label: 'Transformación log', desc: 'log1p para reducir el sesgo de variables muy asimétricas' },
  { key: 'binning', label: 'Binning (cuantiles)', desc: 'convierte una variable continua en categorías ordinales' },
  { key: 'targetEncoding', label: 'Target encoding (con OOF)', desc: 'codifica una categórica usando la media del target, evitando leakage' },
]

export default function FeatureEngGenerator() {
  const [techniques, setTechniques] = useState({
    dateFeatures: true,
    aggregations: true,
    interactions: false,
    logTransform: false,
    binning: false,
    targetEncoding: false,
  })

  const [dateCol, setDateCol] = useState('signup_date')
  const [groupCol, setGroupCol] = useState('user_id')
  const [aggCol, setAggCol] = useState('amount')
  const [numCol1, setNumCol1] = useState('amount')
  const [numCol2, setNumCol2] = useState('quantity')
  const [catColForEncoding, setCatColForEncoding] = useState('city')
  const [targetCol, setTargetCol] = useState('target')
  const [copied, setCopied] = useState(false)

  function toggle(key) {
    setTechniques((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const code = useMemo(
    () => generateFeatureEngCode({ dateCol, groupCol, aggCol, numCol1, numCol2, catColForEncoding, targetCol, techniques }),
    [dateCol, groupCol, aggCol, numCol1, numCol2, catColForEncoding, targetCol, techniques]
  )

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="autoeda baseline-gen">
      <div className="fe-techniques">
        {TECHNIQUES.map((t) => (
          <label key={t.key} className={'fe-technique' + (techniques[t.key] ? ' active' : '')}>
            <input type="checkbox" checked={techniques[t.key]} onChange={() => toggle(t.key)} />
            <div>
              <div className="fe-technique-label">{t.label}</div>
              <div className="fe-technique-desc">{t.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="baseline-grid fe-inputs">
        {techniques.dateFeatures && (
          <div className="field">
            <label>Columna de fecha</label>
            <input value={dateCol} onChange={(e) => setDateCol(e.target.value)} />
          </div>
        )}
        {techniques.aggregations && (
          <>
            <div className="field">
              <label>Columna de grupo</label>
              <input value={groupCol} onChange={(e) => setGroupCol(e.target.value)} />
            </div>
            <div className="field">
              <label>Columna a agregar</label>
              <input value={aggCol} onChange={(e) => setAggCol(e.target.value)} />
            </div>
          </>
        )}
        {(techniques.interactions || techniques.logTransform || techniques.binning) && (
          <div className="field">
            <label>Columna numérica 1</label>
            <input value={numCol1} onChange={(e) => setNumCol1(e.target.value)} />
          </div>
        )}
        {techniques.interactions && (
          <div className="field">
            <label>Columna numérica 2</label>
            <input value={numCol2} onChange={(e) => setNumCol2(e.target.value)} />
          </div>
        )}
        {techniques.targetEncoding && (
          <>
            <div className="field">
              <label>Columna categórica a codificar</label>
              <input value={catColForEncoding} onChange={(e) => setCatColForEncoding(e.target.value)} />
            </div>
            <div className="field">
              <label>Columna target</label>
              <input value={targetCol} onChange={(e) => setTargetCol(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className="autoeda-codebox">
        <pre className="autoeda-code">
          <code>{code}</code>
        </pre>
        <button className="autoeda-copy" onClick={copy}>
          {copied ? 'Copiado ✓' : 'Copiar código'}
        </button>
      </div>
    </div>
  )
}
