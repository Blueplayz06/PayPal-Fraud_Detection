import { useState } from 'react'
import axios from 'axios'
import StatsBar from './components/StatsBar'
import TransactionForm from './components/TransactionForm'
import FraudGauge from './components/FraudGauge'
import ModelCharts from './components/ModelCharts'
import RecentTransactions from './components/RecentTransactions'

const INITIAL_TRANSACTIONS = []

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
    <div className="min-h-screen bg-[#020617] font-sans relative overflow-hidden text-slate-200">
      {/* Background Orbs */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* ── Header ── */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between backdrop-blur-2xl sticky top-0 z-30 border-b border-white/10 bg-[#020617]/50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-float border border-white/20">
              <svg viewBox="0 0 16 16" className="w-5 h-5 text-white" fill="none">
                <path d="M8 1L1 4v4c0 3.5 2.8 6.7 7 7.5C13.2 14.7 15 11.5 15 8V4L8 1z" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-xl blur-lg -z-10 animate-pulse-glow" style={{ background: 'rgba(6,182,212,0.4)' }} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              FraudShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">PayPal Fraud Detection System</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            <span className="text-slate-300 font-mono text-[10px]">creditcard.csv</span>
          </span>
          <span className="flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Model active
          </span>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
        <StatsBar stats={MODEL_STATS} />

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <TransactionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <FraudGauge prediction={prediction} isLoading={isLoading} error={error} />
        </div>

        <ModelCharts stats={MODEL_STATS} />
        <RecentTransactions transactions={transactions} />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 mt-10 border-t border-white/5 bg-[#020617]/50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
          <span>© 2026 FraudShield AI — Built for PayPal</span>
          <span className="flex items-center gap-1.5">
            Powered by
            <span className="font-bold text-cyan-400">Random Forest</span>
            &
            <span className="font-bold text-blue-400">Logistic Regression</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
