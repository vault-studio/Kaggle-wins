import PageHeader from '../components/PageHeader'
import Callout from '../components/Callout'
import Figure from '../components/Figure'
import SubmissionValidator from '../components/SubmissionValidator'
import SubmissionLog from '../components/SubmissionLog'

function ShakeUpSVG() {
  const points = [
    [60, 60], [90, 90], [120, 75], [150, 130], [180, 105],
    [210, 160], [240, 140], [270, 200], [300, 175], [330, 70],
  ]
  return (
    <svg viewBox="0 0 400 230" width="400">
      <text x="200" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Shake-up: tu posición pública no es tu posición final
      </text>
      <line x1="50" y1="200" x2="370" y2="200" stroke="var(--border)" />
      <line x1="50" y1="200" x2="50" y2="30" stroke="var(--border)" />
      <text x="210" y="220" textAnchor="middle" fontSize="11" fill="var(--text)">ranking leaderboard público</text>
      <text x="25" y="115" textAnchor="middle" fontSize="11" fill="var(--text)" transform="rotate(-90 25 115)">ranking leaderboard privado</text>
      <line x1="60" y1="190" x2="360" y2="40" stroke="var(--border)" strokeDasharray="4 4" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={Math.abs(y - (190 - (x - 60) * 0.5)) > 25 ? '#e03131' : 'var(--accent)'} />
      ))}
      <text x="340" y="55" fontSize="10" fill="#e03131" fontWeight="600">se alejan de la diagonal</text>
      <text x="340" y="68" fontSize="10" fill="#e03131">= shake-up fuerte</text>
    </svg>
  )
}

function SubmissionBudgetSVG() {
  return (
    <svg viewBox="0 0 460 150" width="460">
      <text x="230" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text-h)">
        Reparte tu presupuesto de submissions, no lo quemes en lo primero que prueb
      </text>
      <rect x="30" y="40" width="140" height="40" rx="6" fill="rgba(60,180,90,0.18)" stroke="#2f9e44" />
      <text x="100" y="64" textAnchor="middle" fontSize="11" fill="var(--text-h)">validar pipeline (1-2)</text>
      <rect x="180" y="40" width="140" height="40" rx="6" fill="var(--accent-bg)" stroke="var(--accent-border)" />
      <text x="250" y="64" textAnchor="middle" fontSize="11" fill="var(--text-h)">confirmar mejoras CV (resto)</text>
      <rect x="330" y="40" width="100" height="40" rx="6" fill="rgba(230,80,60,0.15)" stroke="#e03131" />
      <text x="380" y="64" textAnchor="middle" fontSize="11" fill="var(--text-h)">2 finales</text>
      <text x="230" y="110" textAnchor="middle" fontSize="10.5" fill="var(--text)">
        No subas algo solo "para ver qué pasa": cada submission debería responder una pregunta concreta sobre tu CV.
      </text>
    </svg>
  )
}

export default function Submissions() {
  return (
    <article>
      <PageHeader
        num={7}
        title="Submissions finales"
        subtitle="Gestiona tu presupuesto de envíos y elige bien las 2 submissions que cuentan para el resultado final."
      />

      <Callout type="tip" title="Regla de oro">
        <p>
          Cada submission debería responder una pregunta concreta ("¿esta feature mejora el LB
          tanto como en mi CV?"), no ser un intento aleatorio. Confía en tu validación local
          (fase 4) para la mayoría de decisiones, y reserva submissions para confirmaciones clave.
        </p>
      </Callout>

      <h2>1. Reparte tu presupuesto de submissions</h2>
      <p>La mayoría de competiciones limitan los envíos diarios. Sé deliberado con cada uno.</p>
      <Figure caption="No quemes submissions en variaciones triviales que ya podrías comparar en tu CV local.">
        <SubmissionBudgetSVG />
      </Figure>

      <h2>2. Cuidado con el shake-up</h2>
      <p>
        El leaderboard público se calcula solo con una parte del test set; el resultado final usa
        el resto (leaderboard privado). Si optimizas en exceso para el público, puedes caer muchas
        posiciones al cierre.
      </p>
      <Figure caption="Cuanto más pequeño es el leaderboard público o más ruidosa la métrica, mayor es el riesgo de shake-up. Confía más en tu CV que en tu posición pública.">
        <ShakeUpSVG />
      </Figure>
      <Callout type="warn" title="Señales de que estás sobreajustando al LB público">
        <ul>
          <li>Subes mucho en el público pero tu CV apenas mejora (o empeora).</li>
          <li>Has elegido hiperparámetros mirando solo el score público, no el de CV.</li>
          <li>El dataset público es pequeño en relación al privado (mira las Rules/Overview).</li>
        </ul>
      </Callout>

      <h2>3. Elige tus 2 submissions finales</h2>
      <p>
        Casi todas las competiciones permiten seleccionar 2 submissions para el resultado final.
        Estrategia recomendada:
      </p>
      <ul>
        <li><strong>Una "segura":</strong> tu mejor modelo según CV, el de menor riesgo de shake-up.</li>
        <li><strong>Una "apuesta":</strong> tu mejor score en el leaderboard público, aunque sea más arriesgada.</li>
      </ul>

      <h2>4. Valida el formato antes de subir</h2>
      <p>Sube tu <code>sample_submission.csv</code> y tu <code>submission.csv</code> para comprobar que columnas, filas e ids coinciden exactamente.</p>
      <SubmissionValidator />

      <h2>Registro de submissions</h2>
      <p>Lleva la cuenta de cada experimento, su score de CV y de leaderboard, y marca cuáles serán tus 2 finales.</p>
      <SubmissionLog />

      <h2>Checklist de cierre</h2>
      <ul>
        <li>☐ Has validado el formato de tu submission contra el sample.</li>
        <li>☐ Tienes registradas las 2 submissions que vas a seleccionar como finales.</li>
        <li>☐ Al menos una de las dos está respaldada por tu score de CV, no solo por el LB público.</li>
        <li>☐ Has revisado las Rules para confirmar que la selección final se hace correctamente antes del cierre.</li>
      </ul>
    </article>
  )
}
