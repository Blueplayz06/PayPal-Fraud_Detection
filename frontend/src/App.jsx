import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import StatsBar from './components/StatsBar'
import TransactionForm from './components/TransactionForm'
import FraudGauge from './components/FraudGauge'
import ModelCharts from './components/ModelCharts'
import RecentTransactions from './components/RecentTransactions'

// In dev, Vite proxy handles /predict → localhost:5000
// In production (Vercel), this points to the Render backend
export const API_BASE = import.meta.env.VITE_API_URL || ''

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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
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
      const { data } = await axios.post(API_BASE + '/predict', formData)
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
    <div className="min-h-screen font-sans relative text-slate-200">
      {/* Ambient background */}
      <div className="bg-ambient"></div>

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-royal-500/10 bg-surface-900/70 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-purple border border-royal-500/30"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              FraudShield <span className="text-royal-400">AI</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">PayPal Fraud Detection System</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            <span className="font-mono text-[10px] text-slate-400">creditcard.csv</span>
          </span>
          <motion.span
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex items-center gap-2 text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Model Active
          </motion.span>
        </div>
      </motion.header>

      {/* Main */}
      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7"
      >
        <motion.div variants={fadeUp}><StatsBar stats={MODEL_STATS} /></motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          <TransactionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <FraudGauge prediction={prediction} isLoading={isLoading} error={error} />
        </motion.div>

        <motion.div variants={fadeUp}><ModelCharts stats={MODEL_STATS} /></motion.div>
        <motion.div variants={fadeUp}><RecentTransactions transactions={transactions} /></motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 mt-8 border-t border-surface-600/30">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
          <span>© 2026 FraudShield AI — PayPal Fraud Detection</span>
          <span className="flex items-center gap-1.5">
            Powered by
            <span className="font-semibold text-royal-400">Random Forest</span>
            &
            <span className="font-semibold text-blue-400">Logistic Regression</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
