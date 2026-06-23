const SPLITTER_IMPORT = {
  kfold: 'from sklearn.model_selection import KFold',
  stratified: 'from sklearn.model_selection import StratifiedKFold',
  group: 'from sklearn.model_selection import GroupKFold',
  timeseries: 'from sklearn.model_selection import TimeSeriesSplit',
}

const SPLITTER_INIT = {
  kfold: (n) => `KFold(n_splits=${n}, shuffle=True, random_state=42)`,
  stratified: (n) => `StratifiedKFold(n_splits=${n}, shuffle=True, random_state=42)`,
  group: (n) => `GroupKFold(n_splits=${n})`,
  timeseries: (n) => `TimeSeriesSplit(n_splits=${n})`,
}

const MODEL_IMPORTS = {
  lightgbm_clf: 'from lightgbm import LGBMClassifier',
  lightgbm_reg: 'from lightgbm import LGBMRegressor',
  logreg: 'from sklearn.linear_model import LogisticRegression',
  linreg: 'from sklearn.linear_model import Ridge',
}

const MODEL_INIT = {
  lightgbm_clf: 'LGBMClassifier(n_estimators=1000, learning_rate=0.05, random_state=42)',
  lightgbm_reg: 'LGBMRegressor(n_estimators=1000, learning_rate=0.05, random_state=42)',
  logreg: 'LogisticRegression(max_iter=1000)',
  linreg: 'Ridge(alpha=1.0)',
}

const METRIC_IMPORTS = {
  auc: 'from sklearn.metrics import roc_auc_score',
  f1: 'from sklearn.metrics import f1_score',
  rmse: 'from sklearn.metrics import mean_squared_error',
  mae: 'from sklearn.metrics import mean_absolute_error',
}

export function generateCvCode({
  cvType,
  nSplits,
  modelKey,
  metricKey,
  trainFile,
  targetCol,
  groupCol,
}) {
  const splitterImport = SPLITTER_IMPORT[cvType]
  const splitterInit = SPLITTER_INIT[cvType](nSplits)
  const modelImport = MODEL_IMPORTS[modelKey]
  const modelInit = MODEL_INIT[modelKey]
  const metricImport = METRIC_IMPORTS[metricKey]
  const isProba = metricKey === 'auc'

  let code = `import numpy as np
import pandas as pd
${splitterImport}
${modelImport}
${metricImport}

train = pd.read_csv("${trainFile || 'train.csv'}")
target_col = "${targetCol || 'TARGET'}"
`

  if (cvType === 'group') {
    code += `group_col = "${groupCol || 'group_id'}"\n`
  }
  if (cvType === 'timeseries') {
    code += `# TimeSeriesSplit espera el dataframe ya ordenado cronológicamente\ntrain = train.sort_values("${groupCol || 'date'}").reset_index(drop=True)\n`
  }

  const dropCols = cvType === 'group' ? `[target_col, group_col]` : `[target_col]`

  code += `
X = train.drop(columns=${dropCols}, errors="ignore")
y = train[target_col]

cv = ${splitterInit}
oof_preds = np.zeros(len(X))
fold_scores = []
`

  const splitArgs = cvType === 'group' ? '(X, y, groups=train[group_col])' : '(X, y)'

  code += `
for fold, (train_idx, val_idx) in enumerate(cv.split${splitArgs}):
    X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

    model = ${modelInit}
    model.fit(X_train, y_train)
`

  if (isProba) {
    code += `    val_pred = model.predict_proba(X_val)[:, 1]\n`
  } else {
    code += `    val_pred = model.predict(X_val)\n`
  }

  code += `    oof_preds[val_idx] = val_pred
`

  const metricCallByFold = {
    auc: 'roc_auc_score(y_val, val_pred)',
    f1: 'f1_score(y_val, val_pred)',
    rmse: 'mean_squared_error(y_val, val_pred) ** 0.5',
    mae: 'mean_absolute_error(y_val, val_pred)',
  }

  code += `    fold_score = ${metricCallByFold[metricKey]}
    fold_scores.append(fold_score)
    print(f"Fold {fold}: ${metricKey.toUpperCase()} = {fold_score:.5f}")

print(f"\\nCV ${metricKey.toUpperCase()}: {np.mean(fold_scores):.5f} +/- {np.std(fold_scores):.5f}")

# oof_preds queda listo para comparar con el leaderboard público
# y para usarlo como input en un ensemble/stacking más adelante.
`

  return code
}
