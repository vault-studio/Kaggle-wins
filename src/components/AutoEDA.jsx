import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { analyzeColumns, detectIssues, defaultSettingsFor } from '../utils/csvAnalysis'
import { generateEdaCode, generatePreprocessingCode } from '../utils/codeGen'
import './AutoEDA.css'

const TYPE_LABEL = {
  numeric: 'Numérica',
  categorical: 'Categórica',
  datetime: 'Fecha',
  text: 'Texto / alta cardinalidad',
  unknown: 'Desconocido',
}

export default function AutoEDA() {
  const [fileName, setFileName] = useState('')
  const [columns, setColumns] = useState(null)
  const [settings, setSettings] = useState({})
  const [targetCol, setTargetCol] = useState('')
  const [tab, setTab] = useState('eda')
  const [copied, setCopied] = useState(false)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.slice(0, 5000)
        const fields = results.meta.fields || []
        const cols = analyzeColumns(rows, fields)
        const initialSettings = {}
        cols.forEach((c) => { initialSettings[c.name] = defaultSettingsFor(c) })
        setColumns(cols)
        setSettings(initialSettings)
        setTargetCol('')
      },
    })
  }

  function updateSetting(name, patch) {
    setSettings((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }))
  }

  const edaCode = useMemo(() => generateEdaCode(fileName), [fileName])

  const preprocessingCode = useMemo(() => {
    if (!columns) return ''
    return generatePreprocessingCode({ fileName, targetCol, columns, settings })
  }, [columns, fileName, targetCol, settings])

  function copy(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="autoeda">
      <div className="autoeda-upload">
        <label className="autoeda-filebtn">
          Subir CSV (train.csv)
          <input type="file" accept=".csv" onChange={handleFile} hidden />
        </label>
        {fileName && <span className="autoeda-filename">{fileName} · {columns?.length ?? 0} columnas</span>}
        <p className="autoeda-note">
          El análisis se hace en tu navegador: el archivo no se sube a ningún servidor.
        </p>
      </div>

      {columns && (
        <>
          <div className="autoeda-target">
            <label>Columna target:</label>
            <select value={targetCol} onChange={(e) => setTargetCol(e.target.value)}>
              <option value="">— selecciona —</option>
              {columns.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="autoeda-table-wrap">
            <table className="autoeda-table">
              <thead>
                <tr>
                  <th>Columna</th>
                  <th>Tipo</th>
                  <th>Nulos</th>
                  <th>Únicos</th>
                  <th>Aviso</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((c) => {
                  const isTarget = c.name === targetCol
                  const s = settings[c.name] || {}
                  const issues = detectIssues(c)
                  return (
                    <tr key={c.name} className={isTarget ? 'is-target' : ''}>
                      <td className="col-name">{c.name}{isTarget && <span className="target-badge">target</span>}</td>
                      <td>{TYPE_LABEL[c.type]}</td>
                      <td className={c.nullPct > 50 ? 'cell-danger' : c.nullPct > 0 ? 'cell-warn' : ''}>
                        {c.nullPct.toFixed(0)}%
                      </td>
                      <td>{c.nUnique}</td>
                      <td className="col-issues">
                        {issues.length === 0 && <span className="issue-ok">sin avisos</span>}
                        {issues.map((iss, i) => (
                          <div key={i} className={`issue issue-${iss.severity}`} title={iss.suggestion}>
                            {iss.message}
                          </div>
                        ))}
                      </td>
                      <td>
                        {isTarget ? (
                          <span className="muted">excluida (es el target)</span>
                        ) : (
                          <div className="action-controls">
                            <select
                              value={s.action}
                              onChange={(e) => updateSetting(c.name, { action: e.target.value })}
                            >
                              <option value="keep">mantener</option>
                              <option value="drop">eliminar</option>
                            </select>
                            {s.action === 'keep' && c.type === 'numeric' && (
                              <>
                                <select value={s.impute} onChange={(e) => updateSetting(c.name, { impute: e.target.value })}>
                                  <option value="none">sin imputar</option>
                                  <option value="mean">imputar: media</option>
                                  <option value="median">imputar: mediana</option>
                                  <option value="constant">imputar: 0</option>
                                </select>
                                <select value={s.scale} onChange={(e) => updateSetting(c.name, { scale: e.target.value })}>
                                  <option value="none">sin escalar</option>
                                  <option value="standard">StandardScaler</option>
                                  <option value="minmax">MinMaxScaler</option>
                                </select>
                              </>
                            )}
                            {s.action === 'keep' && c.type === 'categorical' && (
                              <>
                                <select value={s.impute} onChange={(e) => updateSetting(c.name, { impute: e.target.value })}>
                                  <option value="none">sin imputar</option>
                                  <option value="mode">imputar: moda</option>
                                  <option value="constant">imputar: "missing"</option>
                                </select>
                                <select value={s.encode} onChange={(e) => updateSetting(c.name, { encode: e.target.value })}>
                                  <option value="onehot">One-hot</option>
                                  <option value="ordinal">Ordinal</option>
                                </select>
                              </>
                            )}
                            {s.action === 'keep' && c.type === 'datetime' && (
                              <span className="muted">extraer año/mes/día semana</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="autoeda-codebox">
            <div className="autoeda-tabs">
              <button className={tab === 'eda' ? 'active' : ''} onClick={() => setTab('eda')}>EDA inicial</button>
              <button className={tab === 'prep' ? 'active' : ''} onClick={() => setTab('prep')}>Preprocesado (según tus elecciones)</button>
            </div>
            <pre className="autoeda-code">
              <code>{tab === 'eda' ? edaCode : preprocessingCode}</code>
            </pre>
            <button className="autoeda-copy" onClick={() => copy(tab === 'eda' ? edaCode : preprocessingCode)}>
              {copied ? 'Copiado ✓' : 'Copiar código'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
