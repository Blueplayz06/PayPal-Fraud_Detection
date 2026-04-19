import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
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
      border:{ color: '#1c3050' },
    },
    y: {
      ticks: { color: '#64748b', font: { family: CHART_FONT, size: 10 } },
      grid:  { color: 'rgba(28,48,80,0.2)' },
      border:{ color: '#1c3050' },
    },
  },
}

export default function ModelCharts({ stats }) {
  const { confusionMatrix: cm, modelComparison: mc } = stats

  /* ── Confusion matrix chart ── */
  const cmData = {
    labels: ['True Neg', 'False Pos', 'False Neg', 'True Pos'],
    datasets: [{
      label: 'Count',
      data:  [cm.tn, cm.fp, cm.fn, cm.tp],
      backgroundColor: [
        'rgba(22,163,106,0.25)',
        'rgba(249,115,0,0.2)',
        'rgba(249,115,0,0.2)',
        'rgba(14,165,233,0.25)',
      ],
      borderColor: ['#16a34a', '#f97300', '#f97300', '#0ea5e9'],
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  const cmOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: '#0f1d32',
        borderColor: '#1c3050',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 600 },
        bodyFont: { family: CHART_FONT, size: 11 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ' Count: ' + ctx.parsed.y.toLocaleString()
        }
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

  /* ── Model comparison chart ── */
  const modelData = {
    labels: mc.labels,
    datasets: [
      {
        label:           'Logistic Regression',
        data:            mc.logistic,
        backgroundColor: 'rgba(59,130,246,0.2)',
        borderColor:     '#3b82f6',
        borderWidth:     1,
        borderRadius:    6,
        hoverBackgroundColor: 'rgba(59,130,246,0.35)',
      },
      {
        label:           'Random Forest',
        data:            mc.forest,
        backgroundColor: 'rgba(0,212,255,0.2)',
        borderColor:     '#00d4ff',
        borderWidth:     1,
        borderRadius:    6,
        hoverBackgroundColor: 'rgba(0,212,255,0.35)',
      },
    ]
  }

  const modelOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: '#0f1d32',
        borderColor: '#1c3050',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 600 },
        bodyFont: { family: CHART_FONT, size: 11 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`
        }
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
    <div className="flex gap-4 mt-4 justify-center">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-3 h-3 rounded" style={{ background: color, boxShadow: `0 0 8px ${color}30` }} />
          {label}
        </span>
      ))}
    </div>
  )

  const cmCards = [
    { label: 'True Negative',  value: cm.tn, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.05)', borderClr: 'rgba(16,185,129,0.1)' },
    { label: 'False Positive', value: cm.fp, color: 'text-amber-400',   bg: 'rgba(245,158,11,0.05)', borderClr: 'rgba(245,158,11,0.1)' },
    { label: 'False Negative', value: cm.fn, color: 'text-amber-400',   bg: 'rgba(245,158,11,0.05)', borderClr: 'rgba(245,158,11,0.1)' },
    { label: 'True Positive',  value: cm.tp, color: 'text-cyan-400',    bg: 'rgba(6,182,212,0.05)',   borderClr: 'rgba(6,182,212,0.1)' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {/* Confusion matrix */}
      <div className="glass-card p-6 animate-slide-up z-10" style={{ animationDelay: '0.15s' }}>
        <span className="card-title">Confusion matrix</span>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {cmCards.map(({ label, value, color, bg, borderClr }) => (
            <div
              key={label}
              className="rounded-xl px-3 py-2.5 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: bg, border: `1px solid ${borderClr}` }}
            >
              <p className="text-[10px] text-slate-500 font-medium">{label}</p>
              <p className={`text-lg font-bold ${color} font-mono mt-0.5`}>{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 170 }}>
          <Bar data={cmData} options={cmOptions} />
        </div>
      </div>

      {/* Model comparison */}
      <div className="glass-card p-6 animate-slide-up z-10" style={{ animationDelay: '0.2s' }}>
        <span className="card-title">Model comparison</span>
        <div style={{ height: 230 }}>
          <Bar data={modelData} options={modelOptions} />
        </div>
        <ChartLegend
          items={[
            { color: '#3b82f6', label: 'Logistic Regression' },
            { color: '#00d4ff', label: 'Random Forest' },
          ]}
        />
      </div>
    </div>
  )
}
