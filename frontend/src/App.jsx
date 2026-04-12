import { useState } from 'react'
import axios from 'axios'
import StatsBar from './components/StatsBar'
import TransactionForm from './components/TransactionForm'
import FraudGauge from './components/FraudGauge'
import ModelCharts from './components/ModelCharts'
import RecentTransactions from './components/RecentTransactions'

const INITIAL_TRANSACTIONS = [
  { id: 'TXN-8820', amount: 2.69,   time: 0,     prob: 0.03, status: 'normal', model: 'Random Forest' },
  { id: 'TXN-8819', amount: 378.66, time: 1200,  prob: 0.62, status: 'review', model: 'Random Forest' },
  { id: 'TXN-8818', amount: 44.00,  time: 86400, prob: 0.08, status: 'normal', model: 'Logistic Reg.'  },
  { id: 'TXN-8817', amount: 1.00,   time: 51600, prob: 0.91, status: 'fraud',  model: 'Random Forest' },
  { id: 'TXN-8816', amount: 219.00, time: 3600,  prob: 0.17, status: 'normal', model: 'Random Forest' },
]

export const MODEL_STATS = {
  totalTransactions: 284807,
  fraudDetected: 492,
  accuracy: 99.9,
  f1Score: 0.847,
  confusionMatrix: { tn: 56851, fp: 12, fn: 9, tp: 88 },
  modelComparison: {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
    logistic: [97.8, 82.4, 61.2, 70.3],
    forest:   [99.9, 95.1, 79.6, 86.6],
  }
}

function getStatus(prob) {
  if (prob > 0.7) return 'fraud'
  if (prob > 0.4) return 'review'
  return 'normal'
}

export default function App() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [prediction, setPrediction]     = useState(null)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState(null)

  const handleAnalyze = async (formData) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axios.post('/predict', formData)
      setPrediction(data)

      const newTxn = {
        id:     'TXN-' + Math.floor(1000 + Math.random() * 9000),
        amount: formData.amount,
        time:   formData.time,
        prob:   data.fraud_probability,
        status: getStatus(data.fraud_probability),
        model:  'Random Forest',
      }
      setTransactions(prev => [newTxn, ...prev.slice(0, 9)])
    } catch {
      setError('Cannot reach Flask server on port 5000. Run: python backend/app.py')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050d1a] bg-grid-pattern bg-grid font-mono">
      <div className="scanline" />

      {/* ── Header ── */}
      <header className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-[#050d1a]/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
              <path d="M8 1L1 4v4c0 3.5 2.8 6.7 7 7.5C13.2 14.7 15 11.5 15 8V4L8 1z" fill="#050d1a"/>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">FraudShield AI</h1>
            <p className="text-[11px] text-slate-500">PayPal Fraud Detection System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[11px] text-slate-500">
            Dataset: <span className="text-slate-300">creditcard.csv</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-slow" />
            Model active
          </span>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        <StatsBar stats={MODEL_STATS} />

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <TransactionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <FraudGauge prediction={prediction} isLoading={isLoading} error={error} />
        </div>

        <ModelCharts stats={MODEL_STATS} />
        <RecentTransactions transactions={transactions} />
      </main>
    </div>
  )
}
