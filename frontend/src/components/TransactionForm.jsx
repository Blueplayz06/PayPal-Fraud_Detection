import { useState } from 'react'
import Tilt from 'react-parallax-tilt'

const DEFAULTS = {
  amount: '', time: '',
  v1: 0, v2: 0, v3: 0, v4: 0,
  v14: 0, v17: 0,
}

const FIELD_META = [
  { key: 'amount', label: 'AMOUNT_INR',    full: true,  icon: '💳' },
  { key: 'time',   label: 'TIMESTAMP_S',   full: true,  icon: '⏱️' },
  { key: 'v1',     label: 'V1',            full: false, icon: null },
  { key: 'v2',     label: 'V2',            full: false, icon: null },
  { key: 'v3',     label: 'V3',            full: false, icon: null },
  { key: 'v4',     label: 'V4',            full: false, icon: null },
  { key: 'v14',    label: 'V14 [CRITICAL]',full: false, icon: '⚠️' },
  { key: 'v17',    label: 'V17',           full: false, icon: null },
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
    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500} glareEnable={true} glareMaxOpacity={0.1} glareColor="#00f0ff" glarePosition="all" className="h-full">
      <form onSubmit={handleSubmit} className="cyber-card p-6 flex flex-col gap-6 animate-slide-up h-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-cyan/20 pb-3">
          <span className="card-title mb-0 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] text-shadow">Transaction_Input</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] text-brand-pink hover:text-white transition-colors px-2 py-1 bg-brand-pink/10 border border-brand-pink/30 uppercase font-bold tracking-wider"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleRandom}
              className="text-[10px] text-brand-yellow hover:text-black hover:bg-brand-yellow transition-all duration-200 px-2.5 py-1 bg-brand-yellow/10 border border-brand-yellow/30 flex items-center gap-1 uppercase font-bold tracking-wider"
            >
              Inject_Rand
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          {FIELD_META.map(({ key, label, full, icon }) => (
            <div key={key} className={`${full ? 'col-span-2' : 'col-span-1'} relative group`}>
              <label className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest mb-1.5 transition-colors ${focusedField === key ? 'text-brand-pink drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]' : 'text-brand-cyan/60'}`}>
                {icon && <span className="text-[10px] filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100">{icon}</span>}
                {label}
                {key === 'v14' && (
                  <span className="text-[8px] px-1.5 py-0.5 border border-brand-yellow text-brand-yellow shadow-[0_0_5px_rgba(252,238,9,0.5)] bg-black/50 ml-1">KEY</span>
                )}
              </label>
              <input
                type="number"
                step="any"
                value={fields[key]}
                onChange={(e) => set(key, e.target.value)}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
                className="input-field placeholder:text-brand-cyan/20"
                placeholder={focusedField === key ? '...' : `[${label.toLowerCase()}]`}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading} className="btn-primary mt-auto">
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span>ANALYZING_DATA...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>RUN_DIAGNOSTICS</span>
            </>
          )}
        </button>

        <p className="text-[9px] text-brand-cyan/30 text-center font-mono uppercase tracking-[0.2em]">
          PCA_TRANSFORMED_FEATURES // KAGGLE_DB_V1
        </p>
      </form>
    </Tilt>
  )
}
