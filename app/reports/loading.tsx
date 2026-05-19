const P = 'animate-pulse rounded bg-white/[0.06]'
const card = 'rounded-xl border border-white/[0.06] bg-canvas-800/40'

export default function ReportsLoading() {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">

      {/* Primary report header + Tableau embed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1.5">
            <div className={`${P} h-4 w-52`} />
            <div className={`${P} h-3 w-36`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`${P} hidden sm:block h-6 w-28 rounded-full`} />
            <div className={`${P} h-8 w-36 rounded-lg`} />
          </div>
        </div>
        {/* Matches TableauEmbed responsive height */}
        <div className={`${card} w-full animate-pulse h-[500px] sm:h-[620px] lg:h-[720px]`} />
      </div>

      {/* Upcoming reports */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-4 w-[3px] rounded-full bg-slate-700 shrink-0" />
          <div className={`${P} h-3.5 w-36`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`${card} p-5 space-y-2.5`}>
              <div className="flex items-center gap-2">
                <div className={`${P} h-3.5 w-3.5 rounded`} />
                <div className={`${P} h-3.5 w-36`} />
              </div>
              <div className={`${P} h-3 w-full`} />
              <div className={`${P} h-3 w-4/5`} />
              <div className={`${P} h-3 w-16 mt-1`} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
