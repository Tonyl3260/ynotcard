/**
 * Ynot Card — charts.js
 * Chart.js factories wired to real inventory.json data
 * All placeholder Pokemon data replaced with actual One Piece TCG inventory
 */

/* ─── Global Defaults ─────────────────────────────────────────────────────── */
Chart.defaults.color = '#7A8FAD';
Chart.defaults.font.family = "'Barlow Condensed', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(13,27,42,0.97)';
Chart.defaults.plugins.tooltip.borderColor     = 'rgba(255,255,255,0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding    = 12;
Chart.defaults.plugins.tooltip.titleFont  = { family: "'Barlow Condensed', sans-serif", size: 14, weight: '700' };
Chart.defaults.plugins.tooltip.bodyFont   = { family: "'Barlow Condensed', sans-serif", size: 13 };

/* ─── Palette ──────────────────────────────────────────────────────────────── */
const P = {
  blue:   '#2E6EF7',
  gold:   '#F6C90E',
  green:  '#22C55E',
  red:    '#E53E3E',
  purple: '#9B6DFF',
  teal:   '#14B8A6',
  muted:  '#4A6080',
  blueA:  'rgba(46,110,247,0.18)',
  goldA:  'rgba(246,201,14,0.18)',
  greenA: 'rgba(34,197,94,0.18)',
  redA:   'rgba(229,62,62,0.18)',
};

/* ─── Rarity color map (One Piece TCG) ────────────────────────────────────── */
const RARITY_COLORS = {
  'SR':    P.gold,
  'L':     P.red,
  'SEC':   P.purple,
  'R':     P.blue,
  'PR':    P.teal,
  'DON!!': P.green,
  'UC':    '#60A5FA',
  'C':     P.muted,
  'Unknown': P.muted,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function makeGradient(ctx, color, a1 = 0.4, a2 = 0.0) {
  const r = parseInt(color.slice(1,3),16);
  const g = parseInt(color.slice(3,5),16);
  const b = parseInt(color.slice(5,7),16);
  const gr = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gr.addColorStop(0, `rgba(${r},${g},${b},${a1})`);
  gr.addColorStop(1, `rgba(${r},${g},${b},${a2})`);
  return gr;
}

const gridStyle  = { color: 'rgba(255,255,255,0.05)', drawBorder: false };
const tickStyle  = { color: '#4A6080', padding: 8 };
const fmtUSD = v => '$' + (Math.abs(v) >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(0));

/* ════════════════════════════════════════════════════════════════════════════
   HOME / OVERVIEW CHARTS
════════════════════════════════════════════════════════════════════════════ */

/**
 * Inventory value by rarity — doughnut
 * Data sourced from inventory.json → rarity_breakdown
 */
function initRarityChart(canvasId, rarityData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !rarityData) return;
  const sorted = [...rarityData].sort((a,b) => b.revenue - a.revenue);
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sorted.map(r => r.rarity),
      datasets: [{
        data: sorted.map(r => r.revenue),
        backgroundColor: sorted.map(r => RARITY_COLORS[r.rarity] || P.muted),
        borderColor: '#0D1B2A',
        borderWidth: 3,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { padding: 14, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: $${ctx.parsed.toFixed(2)} (${ctx.dataset.data.reduce((a,b)=>a+b,0) > 0 ? (ctx.parsed / ctx.dataset.data.reduce((a,b)=>a+b,0)*100).toFixed(1) : 0}%)`
          }
        }
      }
    }
  });
}

/**
 * Top sets by listed revenue — horizontal bar
 * Data sourced from inventory.json → set_breakdown
 */
function initSetRevenueChart(canvasId, setData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !setData) return;
  const top = [...setData].sort((a,b) => b.revenue - a.revenue).slice(0,8);
  const labels = top.map(s => s.set.length > 22 ? s.set.slice(0,22)+'…' : s.set);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Listed Value ($)', data: top.map(s => s.revenue), backgroundColor: P.blueA, borderColor: P.blue, borderWidth: 1.5, borderRadius: 5, borderSkipped: false },
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: gridStyle, ticks: { ...tickStyle, callback: fmtUSD }, beginAtZero: true },
        y: { grid: { display: false }, ticks: { ...tickStyle, font: { size: 12 } } }
      }
    }
  });
}

/**
 * Singles vs Sealed revenue split — doughnut
 */
function initRevenueSplitChart(canvasId, summary) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !summary) return;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Singles', 'Sealed (listed)'],
      datasets: [{
        data: [summary.total_singles_revenue, summary.total_sealed_revenue],
        backgroundColor: [P.blue, P.gold],
        borderColor: '#0D1B2A',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: $${ctx.parsed.toFixed(2)}` } }
      }
    }
  });
}

/**
 * Reprice status — bar showing review vs ok vs no_data counts
 * Data computed from inventory.json → singles
 */
function initRepriceChart(canvasId, singles) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !singles) return;
  const review  = singles.filter(s => s.reprice === 'review').length;
  const ok      = singles.filter(s => s.reprice === 'ok').length;
  const no_data = singles.filter(s => s.reprice === 'no_data').length;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Needs Review\n(>20% above mkt)', 'Priced OK', 'No Market Data'],
      datasets: [{
        label: 'Listings',
        data: [review, ok, no_data],
        backgroundColor: [P.goldA, P.greenA, 'rgba(74,96,128,0.18)'],
        borderColor:     [P.gold,  P.green,  P.muted],
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: tickStyle },
        y: { grid: gridStyle, ticks: tickStyle, beginAtZero: true }
      }
    }
  });
}


/* ════════════════════════════════════════════════════════════════════════════
   SEALED PAGE CHARTS
════════════════════════════════════════════════════════════════════════════ */

/**
 * Sealed: listed vs unlisted packs per set — stacked bar
 */
function initSealedPacksChart(canvasId, sealed) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !sealed) return;
  const active = sealed.filter(s => s.total_packs > 0);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: active.map(s => s.short),
      datasets: [
        { label: 'Listed packs',   data: active.map(s => s.listed_packs),   backgroundColor: P.blueA,  borderColor: P.blue,  borderWidth: 1.5, borderRadius: 4, borderSkipped: false },
        { label: 'Unlisted packs', data: active.map(s => s.unlisted_packs), backgroundColor: P.goldA,  borderColor: P.gold,  borderWidth: 1.5, borderRadius: 4, borderSkipped: false },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top', align: 'end' } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: tickStyle },
        y: { stacked: true, grid: gridStyle, ticks: tickStyle, beginAtZero: true }
      }
    }
  });
}

/**
 * Sealed: net profit per bundle — single vs 2-bundle order
 */
function initSealedNetChart(canvasId, sealed) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !sealed) return;
  const active = sealed.filter(s => s.price_per_bundle > 0);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: active.map(s => s.short),
      datasets: [
        { label: 'Net (single order)', data: active.map(s => s.net_single),        backgroundColor: P.blueA,  borderColor: P.blue,  borderWidth: 1.5, borderRadius: 5, borderSkipped: false },
        { label: 'Net (2-bundle order)',data: active.map(s => s.net_double_order),  backgroundColor: P.greenA, borderColor: P.green, borderWidth: 1.5, borderRadius: 5, borderSkipped: false },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: tickStyle },
        y: { grid: gridStyle, ticks: { ...tickStyle, callback: v => '$'+v }, beginAtZero: true }
      }
    }
  });
}

/**
 * Sealed: unlisted revenue potential — shows money left on table
 */
function initSealedPotentialChart(canvasId, sealed) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !sealed) return;
  const active = sealed.filter(s => s.unlisted_revenue_potential > 0);
  if (active.length === 0) {
    ctx.parentElement.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem;">All listable packs are currently listed!</p>';
    return;
  }
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: active.map(s => s.short),
      datasets: [{
        label: 'Potential Revenue ($)',
        data: active.map(s => s.unlisted_revenue_potential),
        backgroundColor: P.goldA,
        borderColor: P.gold,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.y.toFixed(2)} potential` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: tickStyle },
        y: { grid: gridStyle, ticks: { ...tickStyle, callback: fmtUSD }, beginAtZero: true }
      }
    }
  });
}
