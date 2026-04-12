import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
ChartJS.register(ArcElement, Tooltip)

function arcColor(prob) {
  if (prob > 0.7) return '#ff4444'
  if (prob > 0.4) return '#ff9500'
  return '#00cc88'
}

function GaugeMeter({ prob }) {
  const pct   = Math.round(prob * 100)
  const color = arcColor(prob)

  const chartData = {
    datasets: [{
      data:            [pct, 100 - pct],
      backgroundColor: [color, '#1e293b'],
      borderWidth:     0,
      circumference:   200,
      rotation:        -100,
    }]
  }

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '80%',
    plugins: {
      legend:  { display: false },
      tooltip: { enabled: false },
    },
  }

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea: { left, right, bottom } } = chart
      const cx = (left + right) / 2
      const cy = bottom - 10
      ctx.save()
      ctx.font = '700 28px "JetBrains Mono", monospace'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(pct + '%', cx, cy)
      ctx.restore()
    }
  }

  return (
    <div className="relative" style={{ height: 160 }}>
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
    </div>
  )
}

const RISK_FACTORS = [
  { label: 'V14 anomaly',       score: 0.88, level: 'High'   },
  { label: 'Amount deviation',  score: 0.54, level: 'Medium' },
  { label: 'V1 pattern',        score: 0.47, level: 'Medium' },
  { label: 'Time irregularity', score: 0.21, level: 'Low'    },
]

function levelColor(l) {
  if (l === 'High')   return 'text-red-400'
  if (l === 'Medium') return 'text-amber-400'
  return 'text-slate-500'
}

function barColor(s) {
  if (s > 0.7) return 'bg-red-500'
  if (s > 0.4) return 'bg-amber-500'
  return 'bg-slate-600'
}

export default function FraudGauge({ prediction, isLoading, error }) {
  const prob   = prediction?.fraud_probability ?? null
  const hasResult = prob !== null

  return (
    <div className="card flex flex-col gap-5 animate-slide-up">
      <span className="card-title">Fraud probability</span>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        {hasResult ? (
          <>
            <GaugeMeter prob={prob} />
            <p className="text-xs text-slate-500 -mt-2">
              Fraud probability:{' '}
              <span style={{ color: arcColor(prob) }} className="font-semibold">
                {(prob * 100).toFixed(1)}%
              </span>
            </p>
            <div className="mt-3">
              {prob > 0.7 ? (
                <span className="chip-fraud text-sm px-4 py-1.5">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  Fraud detected
                </span>
              ) : prob > 0.4 ? (
                <span className="chip-review text-sm px-4 py-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  Review required
                </span>
              ) : (
                <span className="chip-normal text-sm px-4 py-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Normal transaction
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-xs text-slate-500">Running model inference...</p>
              </div>
            ) : error ? (
              <div className="text-center px-4">
                <p className="text-xs text-red-400 mb-1">Connection error</p>
                <p className="text-[11px] text-slate-600">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-xs text-slate-600">Submit a transaction to see the prediction</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk factors */}
      <div className="border-t border-slate-800 pt-4">
        <p className="text-[11px] text-slate-500 mb-3 tracking-widest uppercase">Risk factors</p>
        <div className="flex flex-col gap-3">
          {RISK_FACTORS.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-400">{f.label}</span>
                <span className={levelColor(f.level)}>{f.level}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor(f.score)}`}
                  style={{ width: `${Math.round(f.score * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction meta */}
      {hasResult && (
        <div className="border-t border-slate-800 pt-3 grid grid-cols-2 gap-2">
          <div className="bg-slate-800/60 rounded-lg px-3 py-2">
            <p className="text-[10px] text-slate-600">Prediction</p>
            <p className="text-sm text-slate-200">{prediction.prediction === 1 ? '1 — Fraud' : '0 — Normal'}</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg px-3 py-2">
            <p className="text-[10px] text-slate-600">Model used</p>
            <p className="text-sm text-slate-200">Random Forest</p>
          </div>
        </div>
      )}
    </div>
  )
}
