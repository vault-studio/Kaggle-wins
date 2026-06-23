import { useMemo, useState } from 'react'
import { generateEnsembleCode } from '../utils/ensembleCodeGen'
import './AutoEDA.css'
import './BaselineGenerator.css'
import './EnsembleGenerator.css'

let nextId = 3

function defaultModels() {
  return [
    { id: 1, key: 'lgbm', oofFile: 'oof_lgbm.csv', testFile: 'test_preds_lgbm.csv', predCol: 'pred', weight: 0.6 },
    { id: 2, key: 'xgb', oofFile: 'oof_xgb.csv', testFile: 'test_preds_xgb.csv', predCol: 'pred', weight: 0.4 },
  ]
}

export default function EnsembleGenerator() {
  const [models, setModels] = useState(defaultModels())
  const [method, setMethod] = useState('weighted')
  const [problemType, setProblemType] = useState('classification')
  const [targetCol, setTargetCol] = useState('target')
  const [copied, setCopied] = useState(false)

  function updateModel(id, patch) {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function addModel() {
    nextId += 1
    setModels((prev) => [...prev, { id: nextId, key: `model_${nextId}`, oofFile: `oof_model_${nextId}.csv`, testFile: `test_preds_model_${nextId}.csv`, predCol: 'pred', weight: 0.3 }])
  }

  function removeModel(id) {
    setModels((prev) => prev.filter((m) => m.id !== id))
  }

  const code = useMemo(
    () => generateEnsembleCode({ models, method, problemType, targetCol }),
    [models, method, problemType, targetCol]
  )

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="autoeda baseline-gen">
      <div className="ensemble-top">
        <div className="field">
          <label>Tipo de problema</label>
          <select value={problemType} onChange={(e) => setProblemType(e.target.value)}>
            <option value="classification">Clasificación</option>
            <option value="regression">Regresión</option>
          </select>
        </div>
        <div className="field">
          <label>Columna target</label>
          <input value={targetCol} onChange={(e) => setTargetCol(e.target.value)} />
        </div>
        <div className="field">
          <label>Método</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="average">Promedio simple</option>
            <option value="weighted">Promedio ponderado</option>
            <option value="stacking">Stacking (meta-modelo)</option>
          </select>
        </div>
      </div>

      <div className="ensemble-models">
        {models.map((m) => (
          <div className="ensemble-model-row" key={m.id}>
            <input
              className="ensemble-key"
              value={m.key}
              onChange={(e) => updateModel(m.id, { key: e.target.value })}
              title="nombre corto del modelo"
            />
            <input
              value={m.oofFile}
              onChange={(e) => updateModel(m.id, { oofFile: e.target.value })}
              placeholder="oof_modelo.csv"
            />
            <input
              value={m.testFile}
              onChange={(e) => updateModel(m.id, { testFile: e.target.value })}
              placeholder="test_preds_modelo.csv"
            />
            <input
              value={m.predCol}
              onChange={(e) => updateModel(m.id, { predCol: e.target.value })}
              placeholder="columna de predicción"
            />
            {method === 'weighted' && (
              <input
                type="number"
                step="0.05"
                value={m.weight}
                onChange={(e) => updateModel(m.id, { weight: Number(e.target.value) })}
                title="peso relativo"
              />
            )}
            <button className="ensemble-remove" onClick={() => removeModel(m.id)} disabled={models.length <= 1}>✕</button>
          </div>
        ))}
        <button className="ensemble-add" onClick={addModel}>+ añadir modelo</button>
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
