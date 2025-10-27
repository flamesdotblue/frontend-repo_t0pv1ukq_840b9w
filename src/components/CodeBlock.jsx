import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => `//@version=5
strategy("Institutional MTF BoS-OB Growth (4H/15M)", overlay=true, max_labels_count=500, max_lines_count=500, initial_capital=50, pyramiding=0, calc_on_every_tick=false, calc_on_order_fills=true, commission_type=strategy.commission.percent, commission_value=0.0)

// =============================
// Constants (fixed by design)
// =============================
var string HTF = "240" // 4H trend timeframe (fixed)
var string LTF = "15"   // 15M execution timeframe (fixed)
var float RR = 2.0       // Fixed risk-to-reward
var int   swingLen = 2   // Swing structure confirmation length

// =============================
// Utilities
// =============================
float nzf(float v, float d) => na(v) ? d : v

// Request HTF data without lookahead to avoid repainting
[htfHigh, htfLow, htfClose] = request.security(syminfo.tickerid, HTF, [high, low, close], lookahead=barmerge.lookahead_off, gaps=barmerge.gaps_off)

// Swing points (confirmed)
hl = ta.pivothigh(high, swingLen, swingLen)
ll = ta.pivotlow(low, swingLen, swingLen)

// Build HTF market structure direction using swings on HTF close
var float htfLastHH = na
var float htfLastLL = na
var int   trend = 0 // 1 = bullish, -1 = bearish, 0 = neutral
if barstate.isconfirmed
    // Update HTF structure only on HTF bar closes
    bosUp = not na(ta.pivothigh(htfHigh, swingLen, swingLen)) and htfClose > nz(htfLastHH, htfHigh)
    bosDn = not na(ta.pivotlow(htfLow, swingLen, swingLen)) and htfClose < nz(htfLastLL, htfLow)
    
    if bosUp
        htfLastHH := htfHigh
        trend := 1
    else if bosDn
        htfLastLL := htfLow
        trend := -1
    else
        trend := trend

// =============================
// Break of Structure (LTF) and Order Block detection
// =============================
var float obLongPrice = na
var float obLongLow   = na
var float obShortPrice = na
var float obShortHigh  = na

// Detect LTF BoS
var float lastSwingHigh = na
var float lastSwingLow  = na
if not na(hl)
    lastSwingHigh := hl
if not na(ll)
    lastSwingLow := ll

bullBos = not na(hl) and close > nz(lastSwingHigh)
bearBos = not na(ll) and close < nz(lastSwingLow)

// On bullish BoS, define last bearish OB (last red candle prior to break)
if barstate.isconfirmed and bullBos
    int lookback = 10
    var float foundOpen = na
    var float foundLow  = na
    for i = 1 to lookback
        isBear = close[i] < open[i]
        if isBear
            foundOpen := open[i]
            foundLow  := low[i]
            break
    obLongPrice := foundOpen
    obLongLow   := foundLow

// On bearish BoS, define last bullish OB (last green candle prior to break)
if barstate.isconfirmed and bearBos
    int lookback2 = 10
    var float foundOpen2 = na
    var float foundHigh2 = na
    for j = 1 to lookback2
        isBull = close[j] > open[j]
        if isBull
            foundOpen2 := open[j]
            foundHigh2 := high[j]
            break
    obShortPrice := foundOpen2
    obShortHigh  := foundHigh2

// =============================
// Phased Growth System: risk scales down as equity grows
// =============================
float eq = nz(strategy.equity, strategy.initial_capital)
float riskPct = eq < 200 ? 0.05 : eq < 500 ? 0.03 : eq < 2000 ? 0.02 : eq < 5000 ? 0.01 : 0.005
string phase = eq < 200 ? "P1: Survival" : eq < 500 ? "P2: Base" : eq < 2000 ? "P3: Growth" : eq < 5000 ? "P4: Sustain" : "P5: Protect"

// =============================
// Entries: limit orders at OB with fixed RR and explicit invalidation
// =============================
// Longs only when HTF trend is bullish; shorts only when bearish

// Long setup
longSetup = trend == 1 and not na(obLongPrice) and not na(obLongLow) and obLongPrice > obLongLow
longStop  = obLongLow - syminfo.mintick * 2
longRisk  = math.max(obLongPrice - longStop, syminfo.mintick)
longTake  = obLongPrice + longRisk * RR

if barstate.isconfirmed and longSetup
    // Risk sizing by cash risk = equity * riskPct
    riskCash = eq * riskPct
    qty = riskCash / longRisk
    strategy.entry("LONG_OB", strategy.long, limit=obLongPrice, qty=qty, when=true)
    strategy.exit("LX", from_entry="LONG_OB", stop=longStop, limit=longTake)

// Short setup
shortSetup = trend == -1 and not na(obShortPrice) and not na(obShortHigh) and obShortPrice < obShortHigh
shortStop  = obShortHigh + syminfo.mintick * 2
shortRisk  = math.max(shortStop - obShortPrice, syminfo.mintick)
shortTake  = obShortPrice - shortRisk * RR

if barstate.isconfirmed and shortSetup
    riskCashS = eq * riskPct
    qtyS = riskCashS / shortRisk
    strategy.entry("SHORT_OB", strategy.short, limit=obShortPrice, qty=qtyS, when=true)
    strategy.exit("SX", from_entry="SHORT_OB", stop=shortStop, limit=shortTake)

// Invalidation of unused OB levels if price runs beyond stop level without fill
if not na(obLongPrice) and low < longStop
    obLongPrice := na
    obLongLow   := na
if not na(obShortPrice) and high > shortStop
    obShortPrice := na
    obShortHigh  := na

// =============================
// Dashboard (non-repainting): draw on bar close
// =============================
var table dash = table.new(position.top_right, 2, 6, border_width=1)
if barstate.isconfirmed
    table.cell(dash, 0, 0, "Phase", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 0, phase)
    table.cell(dash, 0, 1, "Equity", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 1, "$" + str.tostring(eq, format.mintick))
    table.cell(dash, 0, 2, "Risk %", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 2, str.tostring(riskPct * 100, format.percent) + "%")
    table.cell(dash, 0, 3, "Trend (4H)", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 3, trend == 1 ? "Bullish" : trend == -1 ? "Bearish" : "Neutral")
    table.cell(dash, 0, 4, "R:R", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 4, str.tostring(RR, format.mintick) + ":1")
    table.cell(dash, 0, 5, "Status", text_color=color.gray, bgcolor=color.new(color.white, 90))
    table.cell(dash, 1, 5, "Rules Enforced")

// Visualize active OBs
plot(obLongPrice,  color=color.new(color.lime, 0), style=plot.style_circles, linewidth=1, title="Long OB Open")
plot(obShortPrice, color=color.new(color.red, 0), style=plot.style_circles, linewidth=1, title="Short OB Open")
`, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="code" className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white text-xl font-semibold">Pine Script v5 Strategy</h3>
          <p className="text-zinc-400 text-sm">Copy and paste into a new strategy on TradingView. Use on 15-minute charts for liquid FX pairs during London/NY overlap.</p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="relative rounded-xl border border-white/10 bg-zinc-900/80 p-4 overflow-auto text-xs leading-relaxed text-zinc-100">
        <code>{code}</code>
      </pre>
      <p className="text-xs text-zinc-400 mt-3">
        Notes: Signals confirm at bar close with no lookahead. Risk sizing uses live equity for phased scaling. No martingale, grid, or averaging down.
      </p>
    </section>
  );
}
