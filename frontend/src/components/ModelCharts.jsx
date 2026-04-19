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
      ticks: { color: '#00f0ff', font: { family: CHART_FONT, size: 10, weight: 700 }, maxRotation: 0 },
      grid:  { display: false },
      border:{ color: 'rgba(0, 240, 255, 0.3)' },
    },
    y: {
      ticks: { color: '#00f0ff', font: { family: CHART_FONT, size: 10 } },
      grid:  { color: 'rgba(0, 240, 255, 0.1)' },
      border:{ color: 'rgba(0, 240, 255, 0.3)' },
    },
  },
}

export default function ModelCharts({ stats }) {
  const { confusionMatrix: cm, modelComparison: mc } = stats

  /* ── Confusion matrix chart ── */
  const cmData = {
    labels: ['True_Neg', 'False_Pos', 'False_Neg', 'True_Pos'],
    datasets: [{
      label: 'COUNT',
      data:  [cm.tn, cm.fp, cm.fn, cm.tp],
      backgroundColor: [
        'rgba(57, 255, 20, 0.15)', // Green
        'rgba(252, 238, 9, 0.15)', // Yellow
        'rgba(255, 0, 60, 0.15)',  // Pink (Critical)
        'rgba(0, 240, 255, 0.15)', // Cyan
      ],
      borderColor: ['#39ff14', '#fcee09', '#ff003c', '#00f0ff'],
      borderWidth: 1,
      borderRadius: 0,
      hoverBackgroundColor: [
        'rgba(57, 255, 20, 0.4)',
        'rgba(252, 238, 9, 0.4)',
        'rgba(255, 0, 60, 0.4)',
        'rgba(0, 240, 255, 0.4)',
      ],
    }]
  }

  const cmOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#00f0ff',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 700 },
        bodyFont: { family: CHART_FONT, size: 11 },
        titleColor: '#00f0ff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 0,
        callbacks: {
          label: (ctx) => ` COUNT: ${ctx.parsed.y.toLocaleString()}`
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
    labels: mc.labels.map(l => l.toUpperCase().replace(' ', '_')),
    datasets: [
      {
        label:           'LOG_REG',
        data:            mc.logistic,
        backgroundColor: 'rgba(255, 0, 60, 0.15)',
        borderColor:     '#ff003c',
        borderWidth:     1,
        borderRadius:    0,
        hoverBackgroundColor: 'rgba(255, 0, 60, 0.4)',
      },
      {
        label:           'RAND_FOREST',
        data:            mc.forest,
        backgroundColor: 'rgba(0, 240, 255, 0.15)',
        borderColor:     '#00f0ff',
        borderWidth:     1,
        borderRadius:    0,
        hoverBackgroundColor: 'rgba(0, 240, 255, 0.4)',
      },
    ]
  }

  const modelOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#00f0ff',
        borderWidth: 1,
        titleFont: { family: CHART_FONT, size: 12, weight: 700 },
        bodyFont: { family: CHART_FONT, size: 11 },
        titleColor: '#00f0ff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 0,
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
    <div className="flex gap-6 mt-4 justify-center font-mono">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest font-bold">
          <span className="w-3 h-3 border" style={{ background: `${color}40`, borderColor: color, boxShadow: `0 0 8px ${color}80` }} />
          {label}
        </span>
      ))}
    </div>
  )

  const cmCards = [
    { label: 'TRUE_NEGATIVE',  value: cm.tn, color: 'text-brand-green', bg: 'rgba(57,255,20,0.05)', borderClr: 'rgba(57,255,20,0.3)' },
    { label: 'FALSE_POSITIVE', value: cm.fp, color: 'text-brand-yellow', bg: 'rgba(252,238,9,0.05)', borderClr: 'rgba(252,238,9,0.3)' },
    { label: 'FALSE_NEGATIVE', value: cm.fn, color: 'text-brand-pink',   bg: 'rgba(255,0,60,0.05)', borderClr: 'rgba(255,0,60,0.3)' },
    { label: 'TRUE_POSITIVE',  value: cm.tp, color: 'text-brand-cyan',   bg: 'rgba(0,240,255,0.05)', borderClr: 'rgba(0,240,255,0.3)' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Confusion matrix */}
      <div className="cyber-card p-6 animate-slide-up z-10" style={{ animationDelay: '0.15s' }}>
        <span className="card-title drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">Confusion_Matrix</span>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {cmCards.map(({ label, value, color, bg, borderClr }) => (
            <div
              key={label}
              className="px-3 py-2.5 transition-all duration-200 hover:bg-black relative group"
              style={{ background: bg, border: `1px solid ${borderClr}` }}
            >
              <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-50 group-hover:opacity-100" />
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-50 group-hover:opacity-100" />
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest font-mono">{label}</p>
              <p className={`text-lg font-black ${color} font-mono mt-1 drop-shadow-[0_0_5px_currentColor]`}>{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div style={{ height: 170 }}>
          <Bar data={cmData} options={cmOptions} />
        </div>
      </div>

      {/* Model comparison */}
      <div className="cyber-card p-6 animate-slide-up z-10 flex flex-col" style={{ animationDelay: '0.2s' }}>
        <span className="card-title drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">Model_Comparison</span>
        <div style={{ height: 230 }} className="flex-1">
          <Bar data={modelData} options={modelOptions} />
        </div>
        <div className="mt-auto">
          <ChartLegend
            items={[
              { color: '#ff003c', label: 'LOG_REG' },
              { color: '#00f0ff', label: 'RAND_FOREST' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
