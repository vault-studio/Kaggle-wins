import { useState } from 'react'
import Papa from 'papaparse'
import './AutoEDA.css'
import './SubmissionValidator.css'

function parseFile(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve({ rows: res.data, fields: res.meta.fields || [] }),
    })
  })
}

export default function SubmissionValidator() {
  const [sample, setSample] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [checks, setChecks] = useState(null)

  async function handleSample(e) {
    const file = e.target.files[0]
    if (!file) return
    setSample(await parseFile(file))
  }

  async function handleSubmission(e) {
    const file = e.target.files[0]
    if (!file) return
    setSubmission(await parseFile(file))
  }

  function runChecks() {
    if (!sample || !submission) return
    const results = []

    const sameColumns = JSON.stringify(sample.fields) === JSON.stringify(submission.fields)
    results.push({
      ok: sameColumns,
      label: 'Columnas iguales y en el mismo orden',
      detail: sameColumns
        ? `${submission.fields.join(', ')}`
        : `esperado [${sample.fields.join(', ')}] vs tuyo [${submission.fields.join(', ')}]`,
    })

    const sameRowCount = sample.rows.length === submission.rows.length
    results.push({
      ok: sameRowCount,
      label: 'Mismo número de filas',
      detail: `esperado ${sample.rows.length}, tuyo ${submission.rows.length}`,
    })

    const idField = sample.fields[0]
    let idsMatch = true
    if (sameRowCount && idField) {
      const sampleIds = sample.rows.map((r) => r[idField])
      const subIds = submission.rows.map((r) => r[idField])
      idsMatch = sampleIds.every((v, i) => v === subIds[i])
    } else {
      idsMatch = false
    }
    results.push({
      ok: idsMatch,
      label: `Filas en el mismo orden de "${idField}"`,
      detail: idsMatch ? 'coinciden fila a fila' : 'el orden o los valores de id no coinciden exactamente',
    })

    const targetField = sample.fields[sample.fields.length - 1]
    const hasNulls = submission.rows.some((r) => r[targetField] === '' || r[targetField] === undefined)
    results.push({
      ok: !hasNulls,
      label: `Sin valores vacíos en "${targetField}"`,
      detail: hasNulls ? 'hay filas con la predicción vacía' : 'todas las filas tienen un valor',
    })

    setChecks(results)
  }

  return (
    <div className="autoeda submission-validator">
      <div className="sv-uploads">
        <label className="autoeda-filebtn">
          sample_submission.csv
          <input type="file" accept=".csv" onChange={handleSample} hidden />
        </label>
        <label className="autoeda-filebtn">
          tu submission.csv
          <input type="file" accept=".csv" onChange={handleSubmission} hidden />
        </label>
        <button className="autoeda-copy" disabled={!sample || !submission} onClick={runChecks}>
          Validar
        </button>
      </div>
      <p className="autoeda-note">Todo se compara en tu navegador, nada se sube a ningún servidor.</p>

      {checks && (
        <ul className="sv-results">
          {checks.map((c, i) => (
            <li key={i} className={c.ok ? 'sv-ok' : 'sv-fail'}>
              <span className="sv-icon">{c.ok ? '✓' : '✕'}</span>
              <div>
                <div className="sv-label">{c.label}</div>
                <div className="sv-detail">{c.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
