import { useState } from 'react'

const DEFAULTS = {
  amount: 149.62,
  time:   406,
  v1:    -1.3598,
  v2:    -0.0728,
  v3:     2.5363,
  v4:     1.3781,
  v14:   -2.3106,
  v17:   -0.4660,
}

const FIELD_META = [
  { key: 'amount', label: 'Amount (₹)',       full: true  },
  { key: 'time',   label: 'Time (seconds)',    full: true  },
  { key: 'v1',     label: 'V1',               full: false },
  { key: 'v2',     label: 'V2',               full: false },
  { key: 'v3',     label: 'V3',               full: false },
  { key: 'v4',     label: 'V4',               full: false },
  { key: 'v14',    label: 'V14 (high impact)', full: false },
  { key: 'v17',    label: 'V17',              full: false },
]

export default function TransactionForm({ onAnalyze, isLoading }) {
  const [fields, setFields] = useState(DEFAULTS)

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

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="card-title mb-0">Transaction input</span>
        <button
          type="button"
          onClick={handleRandom}
          className="text-[11px] text-cyan-500 hover:text-cyan-300 transition-colors border border-cyan-900 hover:border-cyan-700 px-2.5 py-1 rounded-md"
        >
          Random sample
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FIELD_META.map(({ key, label, full }) => (
          <div key={key} className={full ? 'col-span-2' : 'col-span-1'}>
            <label className="block text-[11px] text-slate-500 mb-1">{label}</label>
            <input
              type="number"
              step="any"
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              className="input-field"
            />
          </div>
        ))}
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Analyze transaction
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-600 text-center">
        V1–V28 are PCA-transformed features from the Kaggle dataset
      </p>
    </form>
  )
}
