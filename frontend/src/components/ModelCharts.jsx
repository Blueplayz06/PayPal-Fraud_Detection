import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { motion } from 'framer-motion'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const CHART_FONT = '"Inter", system-ui, sans-serif'

const BASE_OPTIONS = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { family: CHART_FONT, size: 11, weight: 500 }, maxRotation: 0 },
      grid:  { display: false },
      border:{ color: 'rgba(139, 92, 246, 0.15)' },
    },
    y: {
      ticks: { color: '#64748b', font: { family: CHART_FONT, size: 10 } },
      grid:  { color: 'rgba(139, 92, 246, 0.06)' },
      border:{ color: 'rgba(139, 92, 246, 0.15)' },
    },
  },
}

export default function ModelCharts({ stats }) {
  const { confusionMatrix: cm, modelComparison: mc } = stats

  const cmData = {
    labels: ['True Neg', 'False Pos', 'False Neg', 'True Pos'],
    datasets: [{
      label: 'Count',
      data:  [cm.tn, cm.fp, cm.fn, cm.tp],
      backgroundColor: [
        'rgba(16, 185, 129, 0.2)',
        'rgba(251, 191, 36, 0.2)',
        'rgba(239, 68, 68, 0.2)',
        'rgba(139, 92, 246, 0.2)',
      ],
      borderColor: ['#10b981', '#fbbf24', '#ef4444', '#8b5cf6'],
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(16, 185, 129, 0.35)',
        'rgba(251, 191, 36, 0.35)',
        'rgba(239, 68, 68, 0.35)',
        'rgba(139, 92, 246, 0.35)',
      ],
    }]
  }

  const cmOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: '#0f1629',
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 600 },
        bodyFont: { family: CHART_FONT, size: 11 },
        padding: 12,
        cornerRadius: 10,
        callbacks: { label: (ctx) => ' Count: ' + ctx.parsed.y.toLocaleString() }
      }
    },
    scales: {
      ...BASE_OPTIONS.scales,
      y: {
        ...BASE_OPTIONS.scales.y,
        ticks: {
          ...BASE_OPTIONS.scales.y.ticks,
          callback: (v) => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v,
        }
      }
    }
  }

  const modelData = {
    labels: mc.labels,
    datasets: [
      {
        label:           'Logistic Regression',
        data:            mc.logistic,
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderColor:     '#fbbf24',
        borderWidth:     1,
        borderRadius:    8,
        hoverBackgroundColor: 'rgba(251, 191, 36, 0.3)',
      },
      {
        label:           'Random Forest',
        data:            mc.forest,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor:     '#8b5cf6',
        borderWidth:     1,
        borderRadius:    8,
        hoverBackgroundColor: 'rgba(139, 92, 246, 0.3)',
      },
    ]
  }

  const modelOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: '#0f1629',
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 600 },
        bodyFont: { family: CHART_FONT, size: 11 },
        padding: 12,
        cornerRadius: 10,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%` }
      }
    },
    scales: {
      ...BASE_OPTIONS.scales,
      y: {
        ...BASE_OPTIONS.scales.y,
        min: 55,
        max: 102,
        ticks: {
          ...BASE_OPTIONS.scales.y.ticks,
          callback: (v) => v + '%',
        }
      }
    }
  }

  const ChartLegend = ({ items }) => (
    <div className="flex gap-5 mt-4 justify-center">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-3 h-3 rounded-sm" style={{ background: `${color}30`, border: `1px solid ${color}` }} />
          {label}
        </span>
      ))}
    </div>
  )

  const cmCards = [
    { label: 'True Negative',  value: cm.tn, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15' },
    { label: 'False Positive', value: cm.fp, color: 'text-gold-400',    bg: 'bg-gold-500/5',    border: 'border-gold-500/15' },
    { label: 'False Negative', value: cm.fn, color: 'text-red-400',     bg: 'bg-red-500/5',     border: 'border-red-500/15' },
    { label: 'True Positive',  value: cm.tp, color: 'text-royal-400',   bg: 'bg-royal-500/5',   border: 'border-royal-500/15' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="royal-card p-6"
      >
        <span className="card-title relative z-10">Confusion Matrix</span>
        <div className="grid grid-cols-2 gap-2.5 mb-5 relative z-10">
          {cmCards.map(({ label, value, color, bg, border }) => (
            <div
              key={label}
              className={`rounded-xl px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] ${bg} border ${border}`}
            >
              <p className="text-[10px] text-slate-500 font-medium">{label}</p>
              <p className={`text-lg font-bold ${color} font-mono mt-0.5`}>{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 170 }} className="relative z-10">
          <Bar data={cmData} options={cmOptions} />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="royal-card p-6 flex flex-col"
      >
        <span className="card-title relative z-10">Model Comparison</span>
        <div style={{ height: 230 }} className="relative z-10 flex-1">
          <Bar data={modelData} options={modelOptions} />
        </div>
        <div className="relative z-10">
          <ChartLegend
            items={[
              { color: '#fbbf24', label: 'Logistic Regression' },
              { color: '#8b5cf6', label: 'Random Forest' },
            ]}
          />
        </div>
      </motion.div>
    </div>
  )
}
