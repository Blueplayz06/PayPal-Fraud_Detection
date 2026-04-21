import { useState } from 'react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

const DEFAULTS = {
  amount: '', time: '',
  v1: 0, v2: 0, v3: 0, v4: 0,
  v14: 0, v17: 0,
}

const FIELD_META = [
  { key: 'amount', label: 'Amount (₹)',       full: true,  icon: '💰' },
  { key: 'time',   label: 'Time (seconds)',    full: true,  icon: '⏱️' },
  { key: 'v1',     label: 'V1',               full: false, icon: null },
  { key: 'v2',     label: 'V2',               full: false, icon: null },
  { key: 'v3',     label: 'V3',               full: false, icon: null },
  { key: 'v4',     label: 'V4',               full: false, icon: null },
  { key: 'v14',    label: 'V14 (high impact)', full: false, icon: '⚠️' },
  { key: 'v17',    label: 'V17',              full: false, icon: null },
]

export default function TransactionForm({ onAnalyze, isLoading }) {
  const [fields, setFields] = useState(DEFAULTS)
  const [focusedField, setFocusedField] = useState(null)

  const set = (k, v) => setFields(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, parseFloat(v) || 0])
    )
    onAnalyze(payload)
  }

  const handleRandom = () => {
    const fraud = Math.random() > 0.5
    setFields({
      amount: fraud ? +(Math.random() * 2000).toFixed(2) : +(Math.random() * 200).toFixed(2),
      time:   Math.floor(Math.random() * 172800),
      v1:     +(Math.random() * -6).toFixed(4),
      v2:     +((Math.random() - 0.5) * 4).toFixed(4),
      v3:     +((Math.random() - 0.5) * 6).toFixed(4),
      v4:     +((Math.random() - 0.5) * 4).toFixed(4),
      v14:    fraud ? +(Math.random() * -8).toFixed(4) : +((Math.random() - 0.5) * 3).toFixed(4),
      v17:    +((Math.random() - 0.5) * 4).toFixed(4),
    })
  }

  const handleReset = () => setFields(DEFAULTS)

  return (
    <Tilt tiltMaxAngleX={1.5} tiltMaxAngleY={1.5} scale={1.005} transitionSpeed={2500} glareEnable={true} glareMaxOpacity={0.06} glareColor="#8b5cf6" glarePosition="all" className="h-full">
      <form onSubmit={handleSubmit} className="royal-card p-6 flex flex-col gap-5 h-full">
        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <span className="card-title mb-0">Transaction Input</span>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1 rounded-lg border border-surface-600 bg-surface-800/50 font-medium"
            >
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleRandom}
              className="text-[10px] text-royal-400 hover:text-royal-300 transition-all duration-200 px-2.5 py-1 rounded-lg bg-royal-500/10 border border-royal-500/20 flex items-center gap-1 font-medium"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              Random Sample
            </motion.button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {FIELD_META.map(({ key, label, full, icon }) => (
            <div key={key} className={`${full ? 'col-span-2' : 'col-span-1'}`}>
              <label className={`flex items-center gap-1.5 text-[11px] mb-1.5 font-medium transition-colors duration-200 ${focusedField === key ? 'text-royal-400' : 'text-slate-500'}`}>
                {icon && <span className="text-[10px]">{icon}</span>}
                {label}
                {key === 'v14' && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 font-semibold">KEY</span>
                )}
              </label>
              <input
                type="number"
                step="any"
                value={fields[key]}
                onChange={(e) => set(key, e.target.value)}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
                className="input-field"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-auto relative z-10"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Analyze Transaction</span>
            </>
          )}
        </motion.button>

        <p className="text-[10px] text-slate-600 text-center leading-relaxed relative z-10">
          V1–V28 are PCA-transformed features from the Kaggle credit card dataset
        </p>
      </form>
    </Tilt>
  )
}
