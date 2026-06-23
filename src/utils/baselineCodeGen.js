const MODEL_IMPORTS = {
  lightgbm_clf: 'from lightgbm import LGBMClassifier',
  lightgbm_reg: 'from lightgbm import LGBMRegressor',
  xgboost_clf: 'from xgboost import XGBClassifier',
  xgboost_reg: 'from xgboost import XGBRegressor',
  logreg: 'from sklearn.linear_model import LogisticRegression',
  linreg: 'from sklearn.linear_model import Ridge',
}

const MODEL_INIT = {
  lightgbm_clf: 'LGBMClassifier(n_estimators=1000, learning_rate=0.05, random_state=42)',
  lightgbm_reg: 'LGBMRegressor(n_estimators=1000, learning_rate=0.05, random_state=42)',
  xgboost_clf: 'XGBClassifier(n_estimators=1000, learning_rate=0.05, random_state=42, eval_metric="logloss")',
  xgboost_reg: 'XGBRegressor(n_estimators=1000, learning_rate=0.05, random_state=42)',
  logreg: 'LogisticRegression(max_iter=1000)',
  linreg: 'Ridge(alpha=1.0)',
}

const METRIC_IMPORTS = {
  accuracy: 'from sklearn.metrics import accuracy_score',
  auc: 'from sklearn.metrics import roc_auc_score',
  f1: 'from sklearn.metrics import f1_score',
  rmse: 'from sklearn.metrics import mean_squared_error',
  mae: 'from sklearn.metrics import mean_absolute_error',
}

const METRIC_CALL = {
  accuracy: 'accuracy_score(y_val, val_preds)',
  auc: 'roc_auc_score(y_val, val_proba)',
  f1: 'f1_score(y_val, val_preds)',
  rmse: 'mean_squared_error(y_val, val_preds) ** 0.5',
  mae: 'mean_absolute_error(y_val, val_preds)',
}

export function generateBaselineCode({
  modelKey,
  metricKey,
  trainFile,
  testFile,
  targetCol,
  idCol,
  problemType,
}) {
  const modelImport = MODEL_IMPORTS[modelKey]
  const modelInit = MODEL_INIT[modelKey]
  const metricImport = METRIC_IMPORTS[metricKey]
  const metricCall = METRIC_CALL[metricKey]
  const isClassification = problemType === 'classification'

  let code = `import pandas as pd
from sklearn.model_selection import train_test_split
${modelImport}
${metricImport}

train = pd.read_csv("${trainFile || 'train.csv'}")
test = pd.read_csv("${testFile || 'test.csv'}")

target_col = "${targetCol || 'TARGET'}"
id_col = "${idCol || 'id'}"

X = train.drop(columns=[target_col, id_col], errors="ignore")
y = train[target_col]

# Baseline rápido: sin feature engineering todavía.
# Si hay columnas categóricas, conviértelas antes (one-hot o que el modelo las soporte nativamente).
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42${isClassification ? ', stratify=y' : ''}
)

model = ${modelInit}
model.fit(X_train, y_train)

val_preds = model.predict(X_val)
`

  if (metricKey === 'auc') {
    code += `val_proba = model.predict_proba(X_val)[:, 1]\n`
  }

  code += `score = ${metricCall}
print(f"Validation ${metricKey.toUpperCase()}: {score:.5f}")

# Entrena con todo el train para la submission final
model.fit(X, y)
X_test = test.drop(columns=[id_col], errors="ignore")
`

  if (metricKey === 'auc') {
    code += `test_preds = model.predict_proba(X_test)[:, 1]\n`
  } else {
    code += `test_preds = model.predict(X_test)\n`
  }

  code += `
submission = pd.DataFrame({
    id_col: test[id_col],
    target_col: test_preds,
})
submission.columns = [id_col, target_col]
submission.to_csv("submission.csv", index=False)
submission.head()
`

  return code
}
