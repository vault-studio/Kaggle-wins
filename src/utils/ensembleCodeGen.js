export function generateEnsembleCode({ models, method, problemType, targetCol }) {
  const isClf = problemType === 'classification'
  const metaModel = isClf ? 'LogisticRegression(max_iter=1000)' : 'Ridge(alpha=1.0)'
  const metaImport = isClf
    ? 'from sklearn.linear_model import LogisticRegression'
    : 'from sklearn.linear_model import Ridge'

  let code = `import numpy as np
import pandas as pd

train = pd.read_csv("train.csv")
y = train["${targetCol || 'target'}"]
`

  code += `\n# Predicciones out-of-fold (de la fase 4) y de test, una columna por modelo\n`
  models.forEach((m) => {
    code += `oof_${m.key} = pd.read_csv("${m.oofFile}")["${m.predCol}"].values\n`
    code += `test_${m.key} = pd.read_csv("${m.testFile}")["${m.predCol}"].values\n`
  })

  if (method === 'average') {
    code += `\n# --- Promedio simple ---\noof_blend = (`
    code += models.map((m) => `oof_${m.key}`).join(' + ')
    code += `) / ${models.length}\n`
    code += `test_blend = (`
    code += models.map((m) => `test_${m.key}`).join(' + ')
    code += `) / ${models.length}\n`
  }

  if (method === 'weighted') {
    code += `\n# --- Promedio ponderado ---\n# Ajusta los pesos según el score individual de cada modelo en CV\nweights = {${models.map((m) => `"${m.key}": ${m.weight}`).join(', ')}}\n`
    code += `oof_blend = ` + models.map((m) => `weights["${m.key}"] * oof_${m.key}`).join(' + ') + ` \\\n    / sum(weights.values())\n`
    code += `test_blend = ` + models.map((m) => `weights["${m.key}"] * test_${m.key}`).join(' + ') + ` \\\n    / sum(weights.values())\n`
  }

  if (method === 'stacking') {
    code += `\n# --- Stacking: un meta-modelo aprende a combinar las predicciones ---\n${metaImport}\nfrom sklearn.metrics import roc_auc_score\n`
    code += `\nX_meta_train = np.column_stack([${models.map((m) => `oof_${m.key}`).join(', ')}])\n`
    code += `X_meta_test = np.column_stack([${models.map((m) => `test_${m.key}`).join(', ')}])\n`
    code += `\nmeta_model = ${metaModel}\nmeta_model.fit(X_meta_train, y)\n`
    code += isClf
      ? `oof_blend = meta_model.predict_proba(X_meta_train)[:, 1]\ntest_blend = meta_model.predict_proba(X_meta_test)[:, 1]\n`
      : `oof_blend = meta_model.predict(X_meta_train)\ntest_blend = meta_model.predict(X_meta_test)\n`
  }

  const scoreImport = isClf ? 'roc_auc_score' : 'mean_squared_error'
  code += `\nfrom sklearn.metrics import ${scoreImport}\n`
  code += isClf
    ? `print("CV AUC del ensemble:", roc_auc_score(y, oof_blend))\n`
    : `print("CV RMSE del ensemble:", mean_squared_error(y, oof_blend) ** 0.5)\n`

  code += `
test = pd.read_csv("test.csv")
submission = pd.DataFrame({
    "id": test["id"],
    "${targetCol || 'target'}": test_blend,
})
submission.to_csv("submission.csv", index=False)
`

  return code
}
