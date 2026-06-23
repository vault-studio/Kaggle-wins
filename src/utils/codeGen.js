function pyList(arr) {
  return `[${arr.map((v) => `"${v}"`).join(', ')}]`
}

export function generateEdaCode(fileName) {
  return `import pandas as pd

df = pd.read_csv("${fileName || 'train.csv'}")

print(df.shape)
df.head()
df.info()
df.describe()

# % de nulos por columna, de mayor a menor
(df.isnull().mean() * 100).sort_values(ascending=False)

# Duplicados exactos
df.duplicated().sum()
`
}

export function generatePreprocessingCode({ fileName, targetCol, columns, settings }) {
  const dropCols = columns.filter((c) => settings[c.name]?.action === 'drop').map((c) => c.name)
  const dateCols = columns.filter((c) => c.type === 'datetime' && settings[c.name]?.action === 'keep')
  const keptNumeric = columns.filter((c) => c.type === 'numeric' && settings[c.name]?.action === 'keep' && c.name !== targetCol)
  const keptCategorical = columns.filter((c) => c.type === 'categorical' && settings[c.name]?.action === 'keep' && c.name !== targetCol)

  const numericGroups = new Map()
  keptNumeric.forEach((c) => {
    const s = settings[c.name]
    const key = `${s.impute}|${s.scale}`
    if (!numericGroups.has(key)) numericGroups.set(key, { impute: s.impute, scale: s.scale, cols: [] })
    numericGroups.get(key).cols.push(c.name)
  })

  const categoricalGroups = new Map()
  keptCategorical.forEach((c) => {
    const s = settings[c.name]
    const key = `${s.impute}|${s.encode}`
    if (!categoricalGroups.has(key)) categoricalGroups.set(key, { impute: s.impute, encode: s.encode, cols: [] })
    categoricalGroups.get(key).cols.push(c.name)
  })

  const imputeStrategy = { none: null, mean: 'mean', median: 'median', mode: 'most_frequent', constant: 'constant' }

  let code = `import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

df = pd.read_csv("${fileName || 'train.csv'}")
`

  if (dropCols.length) {
    code += `\n# Columnas descartadas tras el análisis (nulos altos, constantes o alta cardinalidad)\ndf = df.drop(columns=${pyList(dropCols)})\n`
  }

  if (dateCols.length) {
    code += `\n# Features extraídas de columnas de fecha\n`
    dateCols.forEach((c) => {
      code += `df["${c.name}"] = pd.to_datetime(df["${c.name}"])\n`
      code += `df["${c.name}_year"] = df["${c.name}"].dt.year\n`
      code += `df["${c.name}_month"] = df["${c.name}"].dt.month\n`
      code += `df["${c.name}_dayofweek"] = df["${c.name}"].dt.dayofweek\n`
    })
    code += `df = df.drop(columns=${pyList(dateCols.map((c) => c.name))})\n`
  }

  code += `\ntarget_col = "${targetCol || 'TARGET'}"\ny = df[target_col]\nX = df.drop(columns=[target_col])\n`

  code += `\ntransformers = []\n`

  let idx = 0
  for (const [, g] of numericGroups) {
    const steps = []
    if (g.impute !== 'none') steps.push(`("imputer", SimpleImputer(strategy="${imputeStrategy[g.impute]}"))`)
    if (g.scale === 'standard') steps.push(`("scaler", StandardScaler())`)
    if (g.scale === 'minmax') steps.push(`("scaler", MinMaxScaler())`)
    const pipeName = `num_pipeline_${idx}`
    code += `\n${pipeName} = Pipeline(steps=[${steps.length ? '\n    ' + steps.join(',\n    ') + ',\n' : ''}])\n`
    code += `transformers.append(("num_${idx}", ${pipeName}, ${pyList(g.cols)}))\n`
    idx += 1
  }

  idx = 0
  for (const [, g] of categoricalGroups) {
    const steps = []
    if (g.impute !== 'none') steps.push(`("imputer", SimpleImputer(strategy="${imputeStrategy[g.impute]}", fill_value="missing"))`)
    if (g.encode === 'onehot') steps.push(`("encoder", OneHotEncoder(handle_unknown="ignore"))`)
    if (g.encode === 'ordinal') steps.push(`("encoder", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1))`)
    const pipeName = `cat_pipeline_${idx}`
    code += `\n${pipeName} = Pipeline(steps=[${steps.length ? '\n    ' + steps.join(',\n    ') + ',\n' : ''}])\n`
    code += `transformers.append(("cat_${idx}", ${pipeName}, ${pyList(g.cols)}))\n`
    idx += 1
  }

  code += `\npreprocessor = ColumnTransformer(transformers=transformers)\n`
  code += `\nX_processed = preprocessor.fit_transform(X)\nX_processed.shape\n`

  return code
}
