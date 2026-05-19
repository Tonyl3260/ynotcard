const P = 'animate-pulse rounded bg-white/[0.06]'
const card = 'rounded-xl border border-white/[0.06] bg-canvas-800/40'

export default function AnalyticsLoading() {
  return (
    <div className="px-6 pt-8 pb-16 max-w-6xl mx-auto">

      {/* Header + date filter */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className={`${P} h-5 w-36`} />
          <div className={`${P} h-3 w-44`} />
        </div>
        <div className={`${P} h-9 w-40 rounded-lg`} />
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`${card} px-4 py-3 space-y-2`}>
            <div className={`${P} h-2.5 w-16`} />
            <div className={`${P} h-7 w-20`} />
          </div>
        ))}
      </div>

      {/* Sales over time chart */}
      <div className={`${card} p-5 mb-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`${P} h-2.5 w-28`} />
          <div className={`${P} h-6 w-36 rounded-md`} />
        </div>
        <div className={`${P} h-[240px] w-full rounded-lg`} />
      </div>

      {/* Row 2: top sets (3/5) + AOV chart (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className={`${card} lg:col-span-3 p-5`}>
          <div className={`${P} h-2.5 w-40 mb-5`} />
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`${P} h-8 w-full rounded`} />
            ))}
          </div>
        </div>
        <div className={`${card} lg:col-span-2 p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${P} h-2.5 w-28`} />
            <div className={`${P} h-3.5 w-10`} />
          </div>
          <div className={`${P} h-9 w-24 mb-4`} />
          <div className={`${P} h-[160px] w-full rounded-lg`} />
        </div>
      </div>

      {/* Revenue by state chart */}
      <div className={`${card} p-5`}>
        <div className={`${P} h-2.5 w-32 mb-4`} />
        <div className={`${P} h-[220px] w-full rounded-lg`} />
      </div>

    </div>
  )
}
