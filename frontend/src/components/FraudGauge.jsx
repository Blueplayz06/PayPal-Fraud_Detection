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
      backgroundColor: [color, '#142240'],
      borderWidth:     0,
      circumference:   200,
      rotation:        -100,
    }]
  }

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '78%',
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
      ctx.font = '700 32px "JetBrains Mono", monospace'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = color
      ctx.shadowBlur = 20
      ctx.fillText(pct + '%', cx, cy)
      ctx.shadowBlur = 0
      ctx.restore()
    }
  }

  return (
    <div className="relative" style={{ height: 170 }}>
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10"
        style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }}
      />
    </div>
  )
}

function RiskBar({ label, score, level }) {
  const grad = score > 0.7
    ? 'linear-gradient(90deg, #ef4444, #f87171)'
    : score > 0.4
    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
    : 'linear-gradient(90deg, #475569, #64748b)'

  const levelStyle = level === 'High'
    ? { color: '#f87171', background: 'rgba(239,68,68,0.1)' }
    : level === 'Medium'
    ? { color: '#fbbf24', background: 'rgba(245,158,11,0.1)' }
    : { color: '#64748b', background: 'rgba(100,116,139,0.1)' }

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={levelStyle}>
          {level}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-slate-800/80">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.round(score * 100)}%`, background: grad }}
        />
      </div>
    </div>
  )
}

const RISK_FACTORS = [
  { label: 'V14 anomaly',       score: 0.88, level: 'High'   },
  { label: 'Amount deviation',  score: 0.54, level: 'Medium' },
  { label: 'V1 pattern',        score: 0.47, level: 'Medium' },
  { label: 'Time irregularity', score: 0.21, level: 'Low'    },
]

export default function FraudGauge({ prediction, isLoading, error }) {
  const prob   = prediction?.fraud_probability ?? null
  const hasResult = prob !== null

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-slide-up z-10" style={{ animationDelay: '0.1s' }}>
      <span className="card-title">Fraud probability</span>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        {hasResult ? (
          <>
            <GaugeMeter prob={prob} />
            <p className="text-xs text-slate-500 -mt-1">
              Fraud probability:{' '}
              <span style={{ color: arcColor(prob) }} className="font-bold font-mono">
                {(prob * 100).toFixed(1)}%
              </span>
            </p>
            <div className="mt-4">
              {prob > 0.7 ? (
                <span className="chip-fraud text-sm px-5 py-2" style={{ boxShadow: '0 4px 14px rgba(239,68,68,0.1)' }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                  </span>
                  Fraud detected
                </span>
              ) : prob > 0.4 ? (
                <span className="chip-review text-sm px-5 py-2" style={{ boxShadow: '0 4px 14px rgba(245,158,11,0.1)' }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  Review required
                </span>
              ) : (
                <span className="chip-normal text-sm px-5 py-2" style={{ boxShadow: '0 4px 14px rgba(16,185,129,0.1)' }}>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Normal transaction
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-44 gap-3">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-700/50" />
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full animate-spin" style={{ border: '2px solid rgba(34,211,238,0.3)', borderBottomColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-medium">Analyzing transaction</p>
                  <p className="text-[10px] text-slate-600 mt-1">Running model inference...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-xs text-red-400 font-medium mb-1">Connection error</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center mb-4 mx-auto group hover:border-cyan-500/50 transition-colors duration-300">
                  <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium">Awaiting analysis</p>
                <p className="text-[10px] text-slate-600 mt-1">Submit a transaction to see the prediction</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk factors */}
      <div className="pt-5 mt-2 border-t border-white/10">
        <p className="text-[10px] text-slate-500 mb-4 tracking-[0.12em] uppercase font-semibold flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
          </svg>
          Risk factors
        </p>
        <div className="flex flex-col gap-3.5">
          {RISK_FACTORS.map((f) => (
            <RiskBar key={f.label} {...f} />
          ))}
        </div>
      </div>

      {/* Prediction meta */}
      {hasResult && (
        <div className="pt-5 mt-2 border-t border-white/10 grid grid-cols-2 gap-4 animate-fade-in">
          <div className="rounded-xl px-4 py-3 bg-slate-900/40 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Prediction</p>
            <p className="text-sm text-slate-200 font-bold mt-1.5 font-mono">
              {prediction.prediction === 1 ? '1 — Fraud' : '0 — Normal'}
            </p>
          </div>
          <div className="rounded-xl px-4 py-3 bg-slate-900/40 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Model used</p>
            <p className="text-sm text-slate-200 font-bold mt-1.5">Random Forest</p>
          </div>
        </div>
      )}
    </div>
  )
}
