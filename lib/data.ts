import shippingData from '../shipping.json'
import inventoryData from '../inventory.json'

// ── Source-of-truth KPI map ───────────────────────────────────────────────────
//
//  shipping.json → summary
//    total_orders      → "Orders" everywhere (stats strip, hero strip, analytics)
//    unique_states     → "States Reached" everywhere (stats strip, hero strip)
//    total_revenue     → "Revenue" everywhere (stats strip, hero, platform comparison)
//    avg_order_value   → "Avg Order Value" (stats strip, key insights)
//    total_items_sold  → "Items Sold" (analytics page)
//
//  inventory.json → summary
//    grand_total_revenue          → "Total Listed Value" (KPI overview)
//    grand_total_net              → "Net After Fees" (KPI overview)
//    total_singles_listings       → singles count (KPI overview)
//    total_sealed_listings        → boxes/packs count (KPI overview)
//    reprice_review_count         → reprice alerts (removed from KPI overview)
//
// Add new KPI display sites here so drift is visible at a glance.

export const shipping  = shippingData.summary
export const inventory = inventoryData.summary

export const TOTAL_ORDERS    = shipping.total_orders      // 393
export const UNIQUE_STATES   = shipping.unique_states     // 50
export const TOTAL_REVENUE   = shipping.total_revenue     // 11098.93
export const AVG_ORDER_VALUE = shipping.avg_order_value   // 28.24
export const TOTAL_ITEMS     = shipping.total_items_sold  // 749
