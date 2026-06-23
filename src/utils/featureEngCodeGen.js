export function generateFeatureEngCode({
  dateCol,
  groupCol,
  aggCol,
  numCol1,
  numCol2,
  catColForEncoding,
  targetCol,
  techniques,
}) {
  let code = `import pandas as pd
import numpy as np

df = pd.read_csv("train.csv")
`

  if (techniques.dateFeatures) {
    code += `
# --- Features de fecha ---
df["${dateCol}"] = pd.to_datetime(df["${dateCol}"])
df["${dateCol}_year"] = df["${dateCol}"].dt.year
df["${dateCol}_month"] = df["${dateCol}"].dt.month
df["${dateCol}_day"] = df["${dateCol}"].dt.day
df["${dateCol}_dayofweek"] = df["${dateCol}"].dt.dayofweek
df["${dateCol}_is_weekend"] = df["${dateCol}_dayofweek"].isin([5, 6]).astype(int)
`
  }

  if (techniques.aggregations) {
    code += `
# --- Agregaciones por grupo ---
# Resume el comportamiento de cada grupo (ej. cliente, tienda) en nuevas columnas
agg_df = df.groupby("${groupCol}")["${aggCol}"].agg(["mean", "std", "min", "max", "count"])
agg_df.columns = [f"${aggCol}_{stat}_by_${groupCol}" for stat in agg_df.columns]
df = df.merge(agg_df, on="${groupCol}", how="left")
`
  }

  if (techniques.interactions) {
    code += `
# --- Features de interacción ---
df["${numCol1}_x_${numCol2}"] = df["${numCol1}"] * df["${numCol2}"]
df["${numCol1}_div_${numCol2}"] = df["${numCol1}"] / (df["${numCol2}"] + 1e-6)
df["${numCol1}_minus_${numCol2}"] = df["${numCol1}"] - df["${numCol2}"]
`
  }

  if (techniques.logTransform) {
    code += `
# --- Transformación log para reducir sesgo ---
df["${numCol1}_log1p"] = np.log1p(df["${numCol1}"].clip(lower=0))
`
  }

  if (techniques.binning) {
    code += `
# --- Binning de una variable continua ---
df["${numCol1}_bin"] = pd.qcut(df["${numCol1}"], q=5, labels=False, duplicates="drop")
`
  }

  if (techniques.targetEncoding) {
    code += `
# --- Target encoding (CON cuidado de leakage) ---
# Nunca calcules la media del target usando el propio fold de validación.
# Hazlo dentro de cada fold de tu CV (fase 4), usando solo el train de ese fold.
from sklearn.model_selection import KFold

def target_encode_oof(df, col, target_col, n_splits=5, smoothing=10):
    oof = pd.Series(index=df.index, dtype=float)
    global_mean = df[target_col].mean()
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target_col].mean()
        counts = df.iloc[train_idx].groupby(col)[target_col].count()
        smoothed = (means * counts + global_mean * smoothing) / (counts + smoothing)
        oof.iloc[val_idx] = df.iloc[val_idx][col].map(smoothed).fillna(global_mean)
    return oof

df["${catColForEncoding}_target_enc"] = target_encode_oof(df, "${catColForEncoding}", "${targetCol}")
`
  }

  code += `
print(df.shape)
df.head()
`

  return code
}
