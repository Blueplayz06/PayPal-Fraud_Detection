import { motion } from 'framer-motion'

function ProbBar({ prob }) {
  const color = prob > 0.7 ? '#ef4444' : prob > 0.4 ? '#fbbf24' : '#10b981'

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 rounded-full overflow-hidden bg-surface-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(prob * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[11px] font-mono font-semibold" style={{ color }}>
        {Math.round(prob * 100)}%
      </span>
    </div>
  )
}

function StatusChip({ status }) {
  if (status === 'fraud') return (
    <span className="badge-fraud text-[10px]">
      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
      Fraud
    </span>
  )
  if (status === 'review') return (
    <span className="badge-review text-[10px]">
      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
      Review
    </span>
  )
  return (
    <span className="badge-safe text-[10px]">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
      Normal
    </span>
  )
}

export default function RecentTransactions({ transactions }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="royal-card p-6"
    >
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span className="card-title mb-0">Recent Transactions</span>
        <span className="text-[11px] text-slate-500 px-3 py-1 rounded-full font-mono bg-surface-700/50 border border-surface-600/30">
          {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 relative z-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600/50">
              {['Transaction ID', 'Amount (€)', 'Time (s)', 'Fraud Prob.', 'Status', 'Model'].map((h) => (
                <th
                  key={h}
                  className="text-left pb-3 pr-4 text-[10px] tracking-[0.12em] uppercase text-slate-600 font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <motion.tr
                key={t.id + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="row-hover group"
              >
                <td className="py-3.5 pr-4">
                  <span className="text-royal-400 font-semibold text-[12px] font-mono group-hover:text-royal-300 transition-colors">
                    #{t.id}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-slate-300 font-mono text-[13px]">
                  {Number(t.amount).toFixed(2)}
                </td>
                <td className="py-3.5 pr-4 text-slate-500 text-[12px] font-mono">
                  {Number(t.time).toLocaleString()}
                </td>
                <td className="py-3.5 pr-4">
                  <ProbBar prob={t.prob} />
                </td>
                <td className="py-3.5 pr-4">
                  <StatusChip status={t.status} />
                </td>
                <td className="py-3.5 text-slate-500 text-[11px] font-medium">{t.model}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center py-14 gap-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-surface-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 font-medium">No transactions yet</p>
              <p className="text-[10px] text-slate-600 mt-1">Analyze a transaction above to see it here</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
