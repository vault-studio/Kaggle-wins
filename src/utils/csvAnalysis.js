const MAX_ROWS = 5000

function isNumericToken(v) {
  if (v === null || v === undefined || v === '') return false
  return /^-?\d+(\.\d+)?$/.test(String(v).trim())
}

function isDateToken(v) {
  if (!v) return false
  const s = String(v).trim()
  if (!/^\d{4}-\d{1,2}-\d{1,2}/.test(s) && !/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(s)) return false
  return !isNaN(Date.parse(s))
}

function inferType(values) {
  const nonEmpty = values.filter((v) => v !== null && v !== undefined && v !== '')
  if (nonEmpty.length === 0) return 'unknown'
  const n = nonEmpty.length
  const numericRate = nonEmpty.filter(isNumericToken).length / n
  if (numericRate >= 0.9) return 'numeric'
  const dateRate = nonEmpty.filter(isDateToken).length / n
  if (dateRate >= 0.9) return 'datetime'
  const uniques = new Set(nonEmpty)
  if (uniques.size <= Math.max(20, n * 0.5)) return 'categorical'
  return 'text'
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function std(arr, m) {
  const v = mean(arr.map((x) => (x - m) ** 2))
  return Math.sqrt(v)
}

function skewness(arr) {
  const m = mean(arr)
  const s = std(arr, m)
  if (s === 0) return 0
  const n = arr.length
  return (arr.reduce((acc, x) => acc + ((x - m) / s) ** 3, 0)) / n
}

export function analyzeColumns(rows, fields) {
  const n = rows.length
  return fields.map((name) => {
    const values = rows.map((r) => r[name])
    const nonEmpty = values.filter((v) => v !== null && v !== undefined && v !== '')
    const nullCount = n - nonEmpty.length
    const nullPct = n === 0 ? 0 : (nullCount / n) * 100
    const uniqueSet = new Set(nonEmpty)
    const nUnique = uniqueSet.size
    const type = inferType(values)

    const col = {
      name,
      type,
      n,
      nullCount,
      nullPct,
      nUnique,
      sample: Array.from(uniqueSet).slice(0, 5),
    }

    if (type === 'numeric') {
      const nums = nonEmpty.map(Number)
      const m = mean(nums)
      col.mean = m
      col.std = std(nums, m)
      col.min = Math.min(...nums)
      col.max = Math.max(...nums)
      col.skew = skewness(nums)
    }

    if (type === 'categorical' && nonEmpty.length > 0) {
      const counts = {}
      nonEmpty.forEach((v) => { counts[v] = (counts[v] || 0) + 1 })
      col.topValue = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
      col.valueCounts = counts
    }

    return col
  })
}

export function detectIssues(col) {
  const issues = []
  if (col.nullPct > 50) {
    issues.push({
      severity: 'high',
      message: `${col.nullPct.toFixed(0)}% de nulos`,
      suggestion: 'Demasiados nulos para imputar con confianza: considera eliminar la columna o crear un flag binario "es_nulo" si crees que el hueco es informativo.',
    })
  } else if (col.nullPct > 0) {
    issues.push({
      severity: 'low',
      message: `${col.nullPct.toFixed(1)}% de nulos`,
      suggestion: col.type === 'numeric'
        ? 'Imputar con la mediana es razonable si hay outliers; con la media si la distribución es simétrica.'
        : 'Imputar con la moda o con una categoría "missing" explícita.',
    })
  }

  if (col.nUnique <= 1) {
    issues.push({
      severity: 'high',
      message: 'Columna constante',
      suggestion: 'No aporta información (siempre el mismo valor): elimínala.',
    })
  }

  if (col.type === 'text') {
    issues.push({
      severity: 'medium',
      message: `Alta cardinalidad (${col.nUnique} valores únicos)`,
      suggestion: 'Probablemente un identificador o texto libre: elimínala, o usa frequency/hash encoding si crees que aporta señal.',
    })
  }

  if (col.type === 'categorical' && col.nUnique > 15 && col.nUnique <= 50) {
    issues.push({
      severity: 'low',
      message: `Cardinalidad media (${col.nUnique} categorías)`,
      suggestion: 'One-hot encoding generaría muchas columnas: considera ordinal encoding o frequency encoding.',
    })
  }

  if (col.type === 'numeric' && Math.abs(col.skew || 0) > 1) {
    issues.push({
      severity: 'low',
      message: `Distribución sesgada (skew=${col.skew.toFixed(2)})`,
      suggestion: 'Una transformación log1p o escalado robusto puede ayudar más que un StandardScaler estándar.',
    })
  }

  return issues
}

export function defaultSettingsFor(col) {
  const issues = detectIssues(col)
  const hasHighNull = issues.some((i) => i.severity === 'high' && i.message.includes('nulos'))
  const isConstant = col.nUnique <= 1
  const isHighCardinality = col.type === 'text'

  if (isConstant || isHighCardinality || hasHighNull) {
    return { action: 'drop' }
  }

  if (col.type === 'numeric') {
    return {
      action: 'keep',
      impute: col.nullPct > 0 ? 'median' : 'none',
      scale: Math.abs(col.skew || 0) > 1 ? 'minmax' : 'standard',
    }
  }

  if (col.type === 'categorical') {
    return {
      action: 'keep',
      impute: col.nullPct > 0 ? 'mode' : 'none',
      encode: col.nUnique <= 15 ? 'onehot' : 'ordinal',
    }
  }

  if (col.type === 'datetime') {
    return { action: 'keep', dateFeatures: true }
  }

  return { action: 'drop' }
}
