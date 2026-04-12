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

const CHART_FONT = '"JetBrains Mono", monospace'

const BASE_OPTIONS = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { family: CHART_FONT, size: 10 }, maxRotation: 0 },
      grid:  { display: false },
      border:{ color: '#1e293b' },
    },
    y: {
      ticks: { color: '#64748b', font: { family: CHART_FONT, size: 10 } },
      grid:  { color: '#1e293b' },
      border:{ color: '#1e293b' },
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
      backgroundColor: ['#16a34a55', '#f9730044', '#f9730044', '#0ea5e955'],
      borderColor:     ['#16a34a',   '#f97300',   '#f97300',   '#0ea5e9'  ],
      borderWidth: 1,
      borderRadius: 4,
    }]
  }

  const cmOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
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
        backgroundColor: '#1e3a5f',
        borderColor:     '#1e6099',
        borderWidth:     1,
        borderRadius:    4,
      },
      {
        label:           'Random Forest',
        data:            mc.forest,
        backgroundColor: '#0ea5e944',
        borderColor:     '#0ea5e9',
        borderWidth:     1,
        borderRadius:    4,
      },
    ]
  }

  const modelOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`
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

  const Legend = ({ items }) => (
    <div className="flex gap-4 mt-3">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
      {/* Confusion matrix */}
      <div className="card">
        <span className="card-title">Confusion matrix</span>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'True Negative',  value: cm.tn, color: 'text-emerald-400' },
            { label: 'False Positive', value: cm.fp, color: 'text-amber-400'   },
            { label: 'False Negative', value: cm.fn, color: 'text-amber-400'   },
            { label: 'True Positive',  value: cm.tp, color: 'text-cyan-400'    },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-800/50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-slate-600">{label}</p>
              <p className={`text-lg font-semibold ${color}`}>{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 160 }}>
          <Bar data={cmData} options={cmOptions} />
        </div>
      </div>

      {/* Model comparison */}
      <div className="card">
        <span className="card-title">Model comparison</span>
        <div style={{ height: 220 }}>
          <Bar data={modelData} options={modelOptions} />
        </div>
        <Legend
          items={[
            { color: '#1e6099', label: 'Logistic Regression' },
            { color: '#0ea5e9', label: 'Random Forest' },
          ]}
        />
      </div>
    </div>
  )
}
