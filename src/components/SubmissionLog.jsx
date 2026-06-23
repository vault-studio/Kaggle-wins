import { useEffect, useState } from 'react'
import './AutoEDA.css'
import './SubmissionLog.css'

const STORAGE_KEY = 'kaggle-wins-submission-log'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

let nextId = Date.now()

export default function SubmissionLog() {
  const [entries, setEntries] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function addEntry() {
    nextId += 1
    setEntries((prev) => [
      ...prev,
      { id: nextId, desc: '', cv: '', lb: '', selected: false },
    ])
  }

  function update(id, patch) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function remove(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const selectedCount = entries.filter((e) => e.selected).length

  return (
    <div className="autoeda submission-log">
      <p className="autoeda-note" style={{ marginBottom: 12 }}>
        Se guarda en tu navegador (localStorage), no se sube a ningún servidor. Marca como
        "final" tus 2 submissions elegidas para el cierre de la competición.
      </p>

      <table className="autoeda-table sl-table">
        <thead>
          <tr>
            <th>Descripción del experimento</th>
            <th>Score CV</th>
            <th>Score LB público</th>
            <th>Final ✓</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className={e.selected ? 'is-target' : ''}>
              <td>
                <input
                  value={e.desc}
                  onChange={(ev) => update(e.id, { desc: ev.target.value })}
                  placeholder="ej. LightGBM + target encoding city"
                />
              </td>
              <td>
                <input value={e.cv} onChange={(ev) => update(e.id, { cv: ev.target.value })} placeholder="0.812" />
              </td>
              <td>
                <input value={e.lb} onChange={(ev) => update(e.id, { lb: ev.target.value })} placeholder="0.805" />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={e.selected}
                  disabled={!e.selected && selectedCount >= 2}
                  onChange={(ev) => update(e.id, { selected: ev.target.checked })}
                />
              </td>
              <td>
                <button className="ensemble-remove" onClick={() => remove(e.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="ensemble-add" style={{ marginTop: 10 }} onClick={addEntry}>+ añadir submission</button>

      {selectedCount > 0 && (
        <p className="sl-hint">{selectedCount}/2 submissions marcadas como finales.</p>
      )}
    </div>
  )
}
