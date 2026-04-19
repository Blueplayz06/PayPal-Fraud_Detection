import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import Tilt from 'react-parallax-tilt'
ChartJS.register(ArcElement, Tooltip)

function arcColor(prob) {
  if (prob > 0.7) return '#ff003c' // pink
  if (prob > 0.4) return '#fcee09' // yellow
  return '#39ff14' // green
}

function GaugeMeter({ prob }) {
  const pct   = Math.round(prob * 100)
  const color = arcColor(prob)

  const chartData = {
    datasets: [{
      data:            [pct, 100 - pct],
      backgroundColor: [color, '#111'],
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
      ctx.font = '900 36px "JetBrains Mono", monospace'
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
        className="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10 animate-pulse-fast"
        style={{ background: `radial-gradient(circle, ${color}60, transparent 70%)` }}
      />
    </div>
  )
}

function RiskBar({ label, score, level }) {
  const grad = score > 0.7
    ? 'linear-gradient(90deg, #ff003c, #ff4d79)'
    : score > 0.4
    ? 'linear-gradient(90deg, #fcee09, #fdf569)'
    : 'linear-gradient(90deg, #00f0ff, #4dffff)'

  const levelStyle = level === 'High'
    ? { color: '#ff003c', background: 'rgba(255,0,60,0.1)', border: '1px solid #ff003c', boxShadow: '0 0 10px rgba(255,0,60,0.3)' }
    : level === 'Medium'
    ? { color: '#fcee09', background: 'rgba(252,238,9,0.1)', border: '1px solid #fcee09', boxShadow: '0 0 10px rgba(252,238,9,0.3)' }
    : { color: '#00f0ff', background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.3)' }

  return (
    <div>
      <div className="flex items-center justify-between text-[10px] mb-1.5 uppercase font-bold tracking-widest font-mono">
        <span className="text-brand-cyan/70">{label}</span>
        <span className="text-[9px] px-2 py-0.5" style={levelStyle}>
          [{level}]
        </span>
      </div>
      <div className="h-1.5 overflow-hidden bg-black border border-brand-cyan/20">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.round(score * 100)}%`, background: grad, boxShadow: `0 0 10px ${grad.split(',')[1]}` }}
        />
      </div>
    </div>
  )
}

const RISK_FACTORS = [
  { label: 'V14_ANOMALY',       score: 0.88, level: 'High'   },
  { label: 'AMT_DEVIATION',     score: 0.54, level: 'Medium' },
  { label: 'V1_PATTERN',        score: 0.47, level: 'Medium' },
  { label: 'TIME_IRREGULAR',    score: 0.21, level: 'Low'    },
]

export default function FraudGauge({ prediction, isLoading, error }) {
  const prob   = prediction?.fraud_probability ?? null
  const hasResult = prob !== null

  return (
    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500} glareEnable={true} glareMaxOpacity={0.1} glareColor="#ff003c" glarePosition="all" className="h-full">
      <div className="cyber-card p-6 flex flex-col gap-6 animate-slide-up h-full z-10" style={{ animationDelay: '0.1s' }}>
        <span className="card-title drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] text-shadow">Fraud_Probability</span>

        {/* Gauge */}
        <div className="flex flex-col items-center">
          {hasResult ? (
            <>
              <GaugeMeter prob={prob} />
              <p className="text-[10px] text-brand-cyan/60 uppercase tracking-widest font-mono mt-2">
                CONFIDENCE_LEVEL:{' '}
                <span style={{ color: arcColor(prob), textShadow: `0 0 10px ${arcColor(prob)}` }} className="font-bold">
                  {(prob * 100).toFixed(1)}%
                </span>
              </p>
              <div className="mt-4">
                {prob > 0.7 ? (
                  <span className="status-badge status-fraud px-6 py-2">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full bg-brand-pink opacity-75" />
                      <span className="relative inline-flex h-2 w-2 bg-brand-pink" />
                    </span>
                    FRAUD_DETECTED
                  </span>
                ) : prob > 0.4 ? (
                  <span className="status-badge status-review px-6 py-2">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full bg-brand-yellow opacity-75" />
                      <span className="relative inline-flex h-2 w-2 bg-brand-yellow" />
                    </span>
                    REVIEW_REQUIRED
                  </span>
                ) : (
                  <span className="status-badge status-safe px-6 py-2">
                    <span className="w-2 h-2 bg-brand-green mr-1 shadow-[0_0_5px_#39ff14]" />
                    SYS_NORMAL
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 gap-3 w-full">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-sm" />
                    <div className="absolute inset-0 border-2 border-brand-pink border-t-transparent animate-spin rounded-sm" />
                    <div className="absolute inset-2 animate-spin rounded-sm" style={{ border: '2px solid rgba(0,240,255,0.3)', borderBottomColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <div className="text-center font-mono">
                    <p className="text-[10px] text-brand-pink font-bold animate-pulse uppercase tracking-widest">Running_Inference</p>
                    <p className="text-[9px] text-brand-cyan/50 mt-1 uppercase">Awaiting neural net...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center px-4 font-mono">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 mx-auto bg-brand-pink/10 border border-brand-pink text-brand-pink shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="square" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-brand-pink font-bold mb-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]">SYS_ERR_CONNECTION</p>
                  <p className="text-[9px] text-brand-cyan/50 leading-relaxed uppercase">{error}</p>
                </div>
              ) : (
                <div className="text-center font-mono w-full">
                  <div className="w-16 h-16 border-2 border-dashed border-brand-cyan/30 flex items-center justify-center mb-4 mx-auto group-hover:border-brand-cyan transition-colors duration-300 bg-brand-cyan/5">
                    <svg className="w-6 h-6 text-brand-cyan/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Awaiting_Data</p>
                  <p className="text-[9px] text-brand-cyan/40 mt-1 uppercase">Input tx to begin scan</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Risk factors */}
        <div className="pt-5 mt-auto border-t border-brand-cyan/20">
          <p className="text-[10px] text-brand-cyan/60 mb-4 tracking-[0.2em] uppercase font-bold flex items-center gap-2 font-mono">
            <span className="text-brand-pink">>></span> Risk_Factors
          </p>
          <div className="flex flex-col gap-4">
            {RISK_FACTORS.map((f) => (
              <RiskBar key={f.label} {...f} />
            ))}
          </div>
        </div>

        {/* Prediction meta */}
        {hasResult && (
          <div className="pt-5 mt-2 border-t border-brand-cyan/20 grid grid-cols-2 gap-4 animate-fade-in font-mono">
            <div className="px-4 py-3 bg-brand-cyan/5 border border-brand-cyan/30 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-cyan" />
              <p className="text-[9px] text-brand-cyan/60 uppercase tracking-[0.2em] font-bold">Prediction_Result</p>
              <p className={`text-sm font-black mt-1.5 ${prediction.prediction === 1 ? 'text-brand-pink drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]' : 'text-brand-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]'}`}>
                {prediction.prediction === 1 ? '[1] FRAUD' : '[0] NORMAL'}
              </p>
            </div>
            <div className="px-4 py-3 bg-brand-cyan/5 border border-brand-cyan/30 relative">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-cyan" />
              <p className="text-[9px] text-brand-cyan/60 uppercase tracking-[0.2em] font-bold">Model_Active</p>
              <p className="text-sm text-white font-bold mt-1.5 uppercase">Random_Forest</p>
            </div>
          </div>
        )}
      </div>
    </Tilt>
  )
}
