import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen font-sans relative overflow-hidden text-slate-200">
      {/* Background overlays */}
      <div className="bg-scanline-overlay"></div>
      <div className="bg-grid-overlay"></div>

      {/* ── Header ── */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b-2 border-brand-cyan/20 bg-black/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,240,255,0.15)]"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-black border-2 border-brand-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-glitch" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-[0.1em] uppercase">
              FraudShield <span className="text-brand-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">AI</span>
            </h1>
            <p className="text-[10px] text-brand-cyan/60 font-mono tracking-[0.2em] uppercase mt-0.5">SYS.DEF.PROTOCOL</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <span className="hidden md:flex items-center gap-2 text-[10px] font-mono text-brand-pink/80 border border-brand-pink/30 px-3 py-1 bg-brand-pink/5 uppercase">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M20 6c0 2.2-3.7 4-8.2 4S3.7 8.2 3.7 6m16.5 0c0-2.2-3.7-4-8.2-4S3.7 3.8 3.7 6m16.5 0v11c0 2.2-3.7 4-8.2 4s-8.2-1.8-8.2-4V6m16.5 0v3.7m-16.5-3.7v3.7m16.5 0v3.7c0 2.2-3.7 4-8.2 4s-8.2-1.8-8.2-4v-3.7m16.5 0c0 2.2-3.7 4-8.2 4s-8.2-1.8-8.2-4" />
            </svg>
            creditcard.csv
          </span>
          <span className="flex items-center gap-2 text-[11px] font-bold px-4 py-1.5 uppercase tracking-widest text-brand-green border border-brand-green shadow-[0_0_10px_rgba(57,255,20,0.2)] bg-black/50" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-fast absolute inline-flex h-full w-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-brand-green" />
            </span>
            SYSTEM ONLINE
          </span>
        </div>
      </motion.header>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <StatsBar stats={MODEL_STATS} />

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <TransactionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <FraudGauge prediction={prediction} isLoading={isLoading} error={error} />
        </div>

        <ModelCharts stats={MODEL_STATS} />
        <RecentTransactions transactions={transactions} />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 mt-10 border-t-2 border-brand-cyan/20 bg-black/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-cyan/50 font-mono tracking-widest uppercase">
          <span>// 2026 FRAUDSHIELD AI . PAYPAL DIV</span>
          <span className="flex items-center gap-1.5">
            PWR: 
            <span className="font-bold text-brand-pink drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]">RANDOM_FOREST</span>
            &times;
            <span className="font-bold text-brand-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">LOG_REG</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
