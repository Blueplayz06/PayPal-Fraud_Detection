function ProbBar({ prob }) {
  const color = prob > 0.7 ? '#ff4444' : prob > 0.4 ? '#ff9500' : '#00cc88'
  const grad  = prob > 0.7
    ? 'linear-gradient(90deg, #ff4444, #ff6666)'
    : prob > 0.4
    ? 'linear-gradient(90deg, #ff9500, #ffb340)'
    : 'linear-gradient(90deg, #00cc88, #00e699)'

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 rounded-full overflow-hidden bg-slate-800/80">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.round(prob * 100)}%`, background: grad }}
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
    <span className="chip-fraud">
      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
      Fraud
    </span>
  )
  if (status === 'review') return (
    <span className="chip-review">
      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
      Review
    </span>
  )
  return (
    <span className="chip-normal">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
      Normal
    </span>
  )
}

export default function RecentTransactions({ transactions }) {
  return (
    <div className="glass-card p-6 animate-slide-up z-10" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between mb-5">
        <span className="card-title mb-0">Recent transactions</span>
        <span className="text-[11px] text-slate-400 px-3 py-1 rounded-full font-mono bg-slate-800/60 border border-white/5">
          {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['Transaction ID', 'Amount (€)', 'Time (s)', 'Fraud prob.', 'Status', 'Model'].map((h) => (
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
              <tr
                key={t.id + i}
                className="table-row-hover border-b border-white/5"
              >
                <td className="py-3.5 pr-4">
                  <span className="text-cyan-400 font-semibold text-[12px] font-mono">
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
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
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
    </div>
  )
}
