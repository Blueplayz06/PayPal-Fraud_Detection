export default function StatsBar({ stats }) {
  const cards = [
    {
      label: 'Total transactions',
      value: stats.totalTransactions.toLocaleString(),
      sub:   'Kaggle dataset',
      color: 'text-slate-100',
    },
    {
      label: 'Fraud cases',
      value: stats.fraudDetected.toLocaleString(),
      sub:   `${((stats.fraudDetected / stats.totalTransactions) * 100).toFixed(3)}% of total`,
      color: 'text-red-400',
    },
    {
      label: 'Model accuracy',
      value: stats.accuracy.toFixed(1) + '%',
      sub:   'Random Forest',
      color: 'text-emerald-400',
    },
    {
      label: 'F1 Score',
      value: stats.f1Score.toFixed(3),
      sub:   'Fraud class only',
      color: 'text-cyan-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
      {cards.map((c) => (
        <div key={c.label} className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3">
          <p className="text-[11px] tracking-widest uppercase text-slate-500 mb-1">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
