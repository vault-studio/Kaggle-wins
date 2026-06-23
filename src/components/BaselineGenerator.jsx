import { useMemo, useState } from 'react'
import { generateBaselineCode } from '../utils/baselineCodeGen'
import './AutoEDA.css'
import './BaselineGenerator.css'

const MODELS_BY_TYPE = {
  classification: [
    { key: 'lightgbm_clf', label: 'LightGBM (recomendado)' },
    { key: 'xgboost_clf', label: 'XGBoost' },
    { key: 'logreg', label: 'Regresión logística (lineal, rápido de interpretar)' },
  ],
  regression: [
    { key: 'lightgbm_reg', label: 'LightGBM (recomendado)' },
    { key: 'xgboost_reg', label: 'XGBoost' },
    { key: 'linreg', label: 'Ridge (lineal, rápido de interpretar)' },
  ],
}

const METRICS_BY_TYPE = {
  classification: [
    { key: 'auc', label: 'AUC-ROC' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'f1', label: 'F1 Score' },
  ],
  regression: [
    { key: 'rmse', label: 'RMSE' },
    { key: 'mae', label: 'MAE' },
  ],
}

export default function BaselineGenerator() {
  const [problemType, setProblemType] = useState('classification')
  const [modelKey, setModelKey] = useState('lightgbm_clf')
  const [metricKey, setMetricKey] = useState('auc')
  const [trainFile, setTrainFile] = useState('train.csv')
  const [testFile, setTestFile] = useState('test.csv')
  const [targetCol, setTargetCol] = useState('target')
  const [idCol, setIdCol] = useState('id')
  const [copied, setCopied] = useState(false)

  function changeProblemType(value) {
    setProblemType(value)
    setModelKey(MODELS_BY_TYPE[value][0].key)
    setMetricKey(METRICS_BY_TYPE[value][0].key)
  }

  const code = useMemo(
    () => generateBaselineCode({ modelKey, metricKey, trainFile, testFile, targetCol, idCol, problemType }),
    [modelKey, metricKey, trainFile, testFile, targetCol, idCol, problemType]
  )

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="autoeda baseline-gen">
      <div className="baseline-grid">
        <div className="field">
          <label>Tipo de problema</label>
          <select value={problemType} onChange={(e) => changeProblemType(e.target.value)}>
            <option value="classification">Clasificación</option>
            <option value="regression">Regresión</option>
          </select>
        </div>

        <div className="field">
          <label>Modelo</label>
          <select value={modelKey} onChange={(e) => setModelKey(e.target.value)}>
            {MODELS_BY_TYPE[problemType].map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Métrica de validación</label>
          <select value={metricKey} onChange={(e) => setMetricKey(e.target.value)}>
            {METRICS_BY_TYPE[problemType].map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Archivo de train</label>
          <input value={trainFile} onChange={(e) => setTrainFile(e.target.value)} />
        </div>

        <div className="field">
          <label>Archivo de test</label>
          <input value={testFile} onChange={(e) => setTestFile(e.target.value)} />
        </div>

        <div className="field">
          <label>Columna target</label>
          <input value={targetCol} onChange={(e) => setTargetCol(e.target.value)} />
        </div>

        <div className="field">
          <label>Columna id</label>
          <input value={idCol} onChange={(e) => setIdCol(e.target.value)} />
        </div>
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
