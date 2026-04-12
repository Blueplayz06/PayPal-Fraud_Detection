function ProbBar({ prob }) {
  const color = prob > 0.7 ? '#ff4444' : prob > 0.4 ? '#ff9500' : '#00cc88'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.round(prob * 100)}%`, background: color }}
        />
      </div>
      <span className="text-[11px]" style={{ color }}>
        {Math.round(prob * 100)}%
      </span>
    </div>
  )
}

function StatusChip({ status }) {
  if (status === 'fraud')  return <span className="chip-fraud">● Fraud</span>
  if (status === 'review') return <span className="chip-review">● Review</span>
  return <span className="chip-normal">● Normal</span>
}

export default function RecentTransactions({ transactions }) {
  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <span className="card-title mb-0">Recent transactions</span>
        <span className="text-[11px] text-slate-600">{transactions.length} entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {['Transaction ID', 'Amount (€)', 'Time (s)', 'Fraud prob.', 'Status', 'Model'].map((h) => (
                <th
                  key={h}
                  className="text-left pb-2.5 pr-4 text-[11px] tracking-widest uppercase text-slate-600 font-medium whitespace-nowrap"
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
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 pr-4 text-cyan-500 font-medium text-[12px]">#{t.id}</td>
                <td className="py-3 pr-4 text-slate-300">
                  {Number(t.amount).toFixed(2)}
                </td>
                <td className="py-3 pr-4 text-slate-400 text-[12px]">
                  {Number(t.time).toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <ProbBar prob={t.prob} />
                </td>
                <td className="py-3 pr-4">
                  <StatusChip status={t.status} />
                </td>
                <td className="py-3 text-slate-500 text-[11px]">{t.model}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <p className="text-center py-8 text-slate-600 text-xs">
            No transactions analyzed yet. Submit one above.
          </p>
        )}
      </div>
    </div>
  )
}
