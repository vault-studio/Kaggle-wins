import './MetricGlossary.css'

const groups = [
  {
    category: 'Clasificación',
    metrics: [
      { name: 'Accuracy', def: '% de predicciones correctas. Engañosa si las clases están desbalanceadas.' },
      { name: 'Precision', def: 'De lo que predices como positivo, qué % realmente lo es. Importa cuando un falso positivo es caro.' },
      { name: 'Recall', def: 'De todos los positivos reales, qué % detectas. Importa cuando un falso negativo es caro.' },
      { name: 'F1 Score', def: 'Media armónica de Precision y Recall. Buen equilibrio cuando ambas importan.' },
      { name: 'AUC-ROC', def: 'Qué tan bien separa el modelo las clases en todos los umbrales posibles. Robusta a desbalanceo.' },
      { name: 'LogLoss', def: 'Penaliza fuerte las probabilidades predichas con mucha confianza y que resultan erróneas.' },
    ],
  },
  {
    category: 'Regresión',
    metrics: [
      { name: 'RMSE', def: 'Raíz del error cuadrático medio. Penaliza mucho los errores grandes (outliers).' },
      { name: 'MAE', def: 'Error absoluto medio. Trata todos los errores por igual, más robusta a outliers que RMSE.' },
      { name: 'MAPE', def: 'Error porcentual medio. Útil cuando el error relativo importa más que el absoluto.' },
      { name: 'R²', def: 'Qué proporción de la varianza del target explica el modelo. 1 = perfecto, 0 = igual que predecir la media.' },
    ],
  },
  {
    category: 'Ranking / Recomendación',
    metrics: [
      { name: 'MAP@K', def: 'Precisión media en los primeros K resultados, valorando también el orden en que aparecen.' },
      { name: 'NDCG', def: 'Mide la calidad del ranking dando más peso a los resultados relevantes situados arriba.' },
      { name: 'MRR', def: 'Promedio del inverso de la posición del primer resultado relevante.' },
    ],
  },
  {
    category: 'Visión por computador (CV)',
    metrics: [
      { name: 'IoU', def: 'Solapamiento entre la región predicha y la real (cajas o máscaras). 1 = coinciden perfectamente.' },
      { name: 'Dice Coefficient', def: 'Similar a IoU, muy usada en segmentación médica. Más sensible al solapamiento parcial.' },
      { name: 'mAP', def: 'Precision media a través de distintas clases y umbrales de IoU, típica en detección de objetos.' },
    ],
  },
  {
    category: 'Texto (NLP)',
    metrics: [
      { name: 'F1 (token/span)', def: 'F1 aplicado a tokens o spans de texto, frecuente en extracción de entidades o QA.' },
      { name: 'BLEU', def: 'Compara n-gramas entre el texto generado y una referencia. Común en traducción.' },
      { name: 'ROUGE', def: 'Mide solapamiento de n-gramas orientado a resumen automático.' },
      { name: 'Perplexity', def: 'Qué tan "sorprendido" está el modelo de lenguaje por el texto real. Menor es mejor.' },
    ],
  },
  {
    category: 'Series temporales',
    metrics: [
      { name: 'SMAPE', def: 'Error porcentual simétrico, evita los problemas de MAPE cuando el valor real es cercano a 0.' },
      { name: 'WRMSSE', def: 'RMSE escalado y ponderado, usado en competiciones de forecasting jerárquico (ej. M5).' },
      { name: 'Pinball Loss', def: 'Evalúa predicciones cuantílicas (intervalos), no solo el valor puntual.' },
    ],
  },
]

export default function MetricGlossary() {
  return (
    <div className="metric-glossary">
      {groups.map((g) => (
        <div className="metric-group" key={g.category}>
          <h3 className="metric-group-title">{g.category}</h3>
          <dl>
            {g.metrics.map((m) => (
              <div className="metric-row" key={m.name}>
                <dt>{m.name}</dt>
                <dd>{m.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
