import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
ChartJS.register(ArcElement, Tooltip)

function arcColor(prob) {
  if (prob > 0.7) return '#ef4444'
  if (prob > 0.4) return '#fbbf24'
  return '#10b981'
}

function GaugeMeter({ prob }) {
  const pct   = Math.round(prob * 100)
  const color = arcColor(prob)

  const chartData = {
    datasets: [{
      data:            [pct, 100 - pct],
      backgroundColor: [color, 'rgba(30, 38, 66, 0.6)'],
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
      ctx.font = '800 34px "JetBrains Mono", monospace'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = color
      ctx.shadowBlur = 15
      ctx.fillText(pct + '%', cx, cy)
      ctx.shadowBlur = 0
      ctx.restore()
    }
  }

  return (
    <div className="relative" style={{ height: 170 }}>
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-15 -z-10 animate-breathe"
        style={{ background: `radial-gradient(circle, ${color}50, transparent 70%)` }}
      />
    </div>
  )
}

function RiskBar({ label, score, level }) {
  const barColor = score > 0.7
    ? '#ef4444'
    : score > 0.4
    ? '#fbbf24'
    : '#8b5cf6'

  const levelStyle = level === 'High'
    ? 'bg-red-500/10 text-red-400 border-red-500/20'
    : level === 'Medium'
    ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
    : 'bg-royal-500/10 text-royal-400 border-royal-500/20'

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${levelStyle}`}>
          {level}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-surface-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(score * 100)}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: barColor }}
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
    <Tilt tiltMaxAngleX={1.5} tiltMaxAngleY={1.5} scale={1.005} transitionSpeed={2500} glareEnable={true} glareMaxOpacity={0.06} glareColor="#8b5cf6" glarePosition="all" className="h-full">
      <div className="royal-card p-6 flex flex-col gap-5 h-full">
        <span className="card-title relative z-10">Fraud Probability</span>

        {/* Gauge */}
        <div className="flex flex-col items-center relative z-10">
          <AnimatePresence mode="wait">
            {hasResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                <GaugeMeter prob={prob} />
                <p className="text-xs text-slate-500 -mt-1">
                  Fraud probability:{' '}
                  <span style={{ color: arcColor(prob) }} className="font-bold font-mono">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </p>
                <div className="mt-4">
                  {prob > 0.7 ? (
                    <span className="badge-fraud">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                      </span>
                      Fraud Detected
                    </span>
                  ) : prob > 0.4 ? (
                    <span className="badge-review">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
                      </span>
                      Review Required
                    </span>
                  ) : (
                    <span className="badge-safe">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      Normal Transaction
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="flex flex-col items-center justify-center h-44 gap-3">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-surface-600" />
                      <div className="absolute inset-0 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
                      <div className="absolute inset-2 rounded-full animate-spin" style={{ border: '2px solid rgba(139,92,246,0.3)', borderBottomColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Analyzing transaction</p>
                      <p className="text-[10px] text-slate-600 mt-1">Running model inference...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center px-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto bg-red-500/10 border border-red-500/20">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p className="text-xs text-red-400 font-medium mb-1">Connection error</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{error}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-surface-600 flex items-center justify-center mb-4 mx-auto hover:border-royal-500/40 transition-colors duration-300">
                      <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Awaiting analysis</p>
                    <p className="text-[10px] text-slate-600 mt-1">Submit a transaction to see the prediction</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Risk factors */}
        <div className="pt-5 mt-auto border-t border-surface-600/50 relative z-10">
          <p className="text-[10px] text-slate-500 mb-4 tracking-[0.12em] uppercase font-semibold flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
            Risk Factors
          </p>
          <div className="flex flex-col gap-3.5">
            {RISK_FACTORS.map((f) => (
              <RiskBar key={f.label} {...f} />
            ))}
          </div>
        </div>

        {/* Prediction meta */}
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-5 border-t border-surface-600/50 grid grid-cols-2 gap-4 relative z-10"
          >
            <div className="rounded-xl px-4 py-3 bg-surface-800/80 border border-surface-600/30">
              <p className="text-[10px] text-slate-600 font-medium">Prediction</p>
              <p className="text-sm text-slate-200 font-bold mt-1 font-mono">
                {prediction.prediction === 1 ? '1 — Fraud' : '0 — Normal'}
              </p>
            </div>
            <div className="rounded-xl px-4 py-3 bg-surface-800/80 border border-surface-600/30">
              <p className="text-[10px] text-slate-600 font-medium">Model used</p>
              <p className="text-sm text-slate-200 font-bold mt-1">Random Forest</p>
            </div>
          </motion.div>
        )}
      </div>
    </Tilt>
  )
}
