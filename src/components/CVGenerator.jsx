import { useMemo, useState } from 'react'
import { generateCvCode } from '../utils/cvCodeGen'
import './AutoEDA.css'
import './BaselineGenerator.css'

const CV_TYPES = [
  { key: 'kfold', label: 'KFold', hint: 'Datos i.i.d. sin estructura de grupos ni clases muy desbalanceadas.' },
  { key: 'stratified', label: 'StratifiedKFold', hint: 'Clasificación con clases desbalanceadas: mantiene la proporción de clases en cada fold.' },
  { key: 'group', label: 'GroupKFold', hint: 'Cuando varias filas pertenecen a la misma entidad (usuario, paciente...) y no deben repartirse entre folds.' },
  { key: 'timeseries', label: 'TimeSeriesSplit', hint: 'Series temporales: cada fold de validación es siempre posterior en el tiempo al de entrenamiento.' },
]

const MODELS = [
  { key: 'lightgbm_clf', label: 'LightGBM (clasificación)' },
  { key: 'logreg', label: 'Regresión logística' },
  { key: 'lightgbm_reg', label: 'LightGBM (regresión)' },
  { key: 'linreg', label: 'Ridge (regresión)' },
]

const METRICS = [
  { key: 'auc', label: 'AUC-ROC' },
  { key: 'f1', label: 'F1 Score' },
  { key: 'rmse', label: 'RMSE' },
  { key: 'mae', label: 'MAE' },
]

export default function CVGenerator() {
  const [cvType, setCvType] = useState('stratified')
  const [nSplits, setNSplits] = useState(5)
  const [modelKey, setModelKey] = useState('lightgbm_clf')
  const [metricKey, setMetricKey] = useState('auc')
  const [trainFile, setTrainFile] = useState('train.csv')
  const [targetCol, setTargetCol] = useState('target')
  const [groupCol, setGroupCol] = useState('group_id')
  const [copied, setCopied] = useState(false)

  const activeHint = CV_TYPES.find((c) => c.key === cvType)?.hint

  const code = useMemo(
    () => generateCvCode({ cvType, nSplits, modelKey, metricKey, trainFile, targetCol, groupCol }),
    [cvType, nSplits, modelKey, metricKey, trainFile, targetCol, groupCol]
  )

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="autoeda baseline-gen">
      <div className="cv-type-picker">
        {CV_TYPES.map((c) => (
          <button
            key={c.key}
            className={'cv-type-btn' + (cvType === c.key ? ' active' : '')}
            onClick={() => setCvType(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {activeHint && <p className="cv-hint">{activeHint}</p>}

      <div className="baseline-grid">
        <div className="field">
          <label>Nº de folds</label>
          <input type="number" min="2" max="10" value={nSplits} onChange={(e) => setNSplits(Number(e.target.value))} />
        </div>

        <div className="field">
          <label>Modelo</label>
          <select value={modelKey} onChange={(e) => setModelKey(e.target.value)}>
            {MODELS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Métrica</label>
          <select value={metricKey} onChange={(e) => setMetricKey(e.target.value)}>
            {METRICS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Archivo de train</label>
          <input value={trainFile} onChange={(e) => setTrainFile(e.target.value)} />
        </div>

        <div className="field">
          <label>Columna target</label>
          <input value={targetCol} onChange={(e) => setTargetCol(e.target.value)} />
        </div>

        {(cvType === 'group' || cvType === 'timeseries') && (
          <div className="field">
            <label>{cvType === 'group' ? 'Columna de grupo' : 'Columna de fecha'}</label>
            <input value={groupCol} onChange={(e) => setGroupCol(e.target.value)} />
          </div>
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
