function ProbBar({ prob }) {
  const isHigh = prob > 0.7
  const isMed  = prob > 0.4
  const color = isHigh ? '#ff003c' : isMed ? '#fcee09' : '#39ff14'
  
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 overflow-hidden bg-black border border-brand-cyan/20">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${Math.round(prob * 100)}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold" style={{ color, textShadow: `0 0 5px ${color}` }}>
        {Math.round(prob * 100)}%
      </span>
    </div>
  )
}

function StatusChip({ status }) {
  if (status === 'fraud') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-pink tracking-widest uppercase bg-brand-pink/10 px-2 py-0.5 border border-brand-pink/50">
      <span className="w-1.5 h-1.5 bg-brand-pink shadow-[0_0_5px_#ff003c] animate-pulse" />
      FRAUD
    </span>
  )
  if (status === 'review') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-yellow tracking-widest uppercase bg-brand-yellow/10 px-2 py-0.5 border border-brand-yellow/50">
      <span className="w-1.5 h-1.5 bg-brand-yellow shadow-[0_0_5px_#fcee09]" />
      REVIEW
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-green tracking-widest uppercase bg-brand-green/10 px-2 py-0.5 border border-brand-green/50">
      <span className="w-1.5 h-1.5 bg-brand-green shadow-[0_0_5px_#39ff14]" />
      NORMAL
    </span>
  )
}

export default function RecentTransactions({ transactions }) {
  return (
    <div className="cyber-card p-6 animate-slide-up z-10" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between mb-5 border-b border-brand-cyan/20 pb-3">
        <span className="card-title mb-0 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] text-shadow">Transaction_Log</span>
        <span className="text-[10px] text-brand-cyan font-bold px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 tracking-widest uppercase font-mono">
          [ {transactions.length} ] ENTRIES
        </span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b-2 border-brand-cyan/30">
              {['TXN_ID', 'AMT_INR', 'TIME_S', 'FRAUD_PROB', 'STATUS', 'MODEL'].map((h) => (
                <th
                  key={h}
                  className="text-left pb-3 pr-4 text-[10px] tracking-[0.2em] uppercase text-brand-cyan font-bold whitespace-nowrap"
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
                className="table-row-hover relative group"
              >
                <td className="py-3.5 pr-4 relative">
                  <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-1 bg-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-white font-bold text-[11px] tracking-wider">
                    {t.id}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-brand-cyan/80 text-[11px]">
                  {Number(t.amount).toFixed(2)}
                </td>
                <td className="py-3.5 pr-4 text-brand-cyan/50 text-[11px]">
                  {Number(t.time).toLocaleString()}
                </td>
                <td className="py-3.5 pr-4">
                  <ProbBar prob={t.prob} />
                </td>
                <td className="py-3.5 pr-4">
                  <StatusChip status={t.status} />
                </td>
                <td className="py-3.5 text-brand-cyan/50 text-[10px] uppercase tracking-widest">{t.model.replace(' ', '_')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-4 font-mono relative">
            <div className="absolute inset-0 bg-brand-cyan/5 flex items-center justify-center animate-pulse" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,240,255,0.05) 10px, rgba(0,240,255,0.05) 20px)' }} />
            <div className="w-16 h-16 border-2 border-brand-pink flex items-center justify-center bg-brand-pink/10 shadow-[0_0_15px_rgba(255,0,60,0.4)] relative z-10" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <svg className="w-8 h-8 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="text-center relative z-10">
              <p className="text-[11px] text-brand-pink font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]">SYS_LOG_EMPTY</p>
              <p className="text-[9px] text-brand-cyan/50 mt-1 uppercase tracking-widest">Awaiting new data streams</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
