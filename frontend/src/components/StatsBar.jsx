import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value

  useEffect(() => {
    if (!ref.current || isNaN(numericValue)) return
    let start = 0
    const duration = 1400
    const startTime = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = start + (numericValue - start) * eased

      if (ref.current) {
        ref.current.textContent = (decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString()
        ) + suffix
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [numericValue, suffix, decimals])

  return <span ref={ref}>0{suffix}</span>
}

const ICONS = {
  transactions: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  fraud: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  accuracy: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  f1: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
}

export default function StatsBar({ stats }) {
  const cards = [
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      suffix: '',
      decimals: 0,
      sub:   'Kaggle Dataset',
      color: 'text-white',
      iconColor: 'text-royal-400',
      accentColor: '#8b5cf6',
      icon: ICONS.transactions,
    },
    {
      label: 'Fraud Cases',
      value: stats.fraudDetected,
      suffix: '',
      decimals: 0,
      sub:   `${((stats.fraudDetected / stats.totalTransactions) * 100).toFixed(3)}% of total`,
      color: 'text-red-400',
      iconColor: 'text-red-400',
      accentColor: '#ef4444',
      icon: ICONS.fraud,
    },
    {
      label: 'Model Accuracy',
      value: stats.accuracy,
      suffix: '%',
      decimals: 1,
      sub:   'Random Forest',
      color: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      accentColor: '#10b981',
      icon: ICONS.accuracy,
    },
    {
      label: 'F1 Score',
      value: stats.f1Score,
      suffix: '',
      decimals: 3,
      sub:   'Fraud class only',
      color: 'gold-shimmer',
      iconColor: 'text-gold-400',
      accentColor: '#fbbf24',
      icon: ICONS.f1,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          className="royal-card p-5 sm:p-6 group"
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, transparent, ${c.accentColor}, transparent)` }}
          />

          <div className="flex items-start justify-between mb-3 relative z-10">
            <p className="text-[11px] tracking-[0.12em] uppercase text-slate-500 font-medium">
              {c.label}
            </p>
            <span className={`${c.iconColor} opacity-40 group-hover:opacity-80 transition-opacity duration-300`}>
              {c.icon}
            </span>
          </div>

          <p className={`text-2xl sm:text-3xl font-extrabold ${c.color} font-mono tracking-tight relative z-10`}>
            <AnimatedNumber value={c.value} suffix={c.suffix} decimals={c.decimals} />
          </p>
          <p className="text-[11px] text-slate-600 mt-1.5 relative z-10">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}
