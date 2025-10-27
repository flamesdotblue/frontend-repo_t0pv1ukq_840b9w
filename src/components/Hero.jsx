import { Lock, LineChart, Target, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            A rigid, machine-like Pine Script strategy built for disciplined growth
          </h2>
          <p className="mt-4 text-zinc-300">
            Multi-timeframe market structure with strict risk controls. Designed to grow a small account
            from $50 to $10,000 by mastering a single, high-probability setup. No repainting. No martingale.
            No guesswork.
          </p>

          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <Clock className="text-emerald-400" size={18} />
              <span>4H trend + 15M execution (fixed)</span>
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <LineChart className="text-emerald-400" size={18} />
              <span>BoS + Order Block retracement entries</span>
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <Target className="text-emerald-400" size={18} />
              <span>Fixed R:R, explicit stops</span>
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <Lock className="text-emerald-400" size={18} />
              <span>Phased risk scaling to protect gains</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Dashboard Preview</p>
              <h3 className="text-xl font-semibold text-white mt-1">Live Discipline Panel</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Non‑Repainting</span>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <Metric label="Phase" value="Survival (P1)" accent="emerald" />
            <Metric label="Equity" value="$50.00" accent="cyan" />
            <Metric label="Risk / Trade" value="5% (Enforced)" accent="amber" />
            <Metric label="4H Trend" value="Bullish" accent="violet" />
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Entries trigger only on bar close. Levels lock once formed. Every trade is independent with
            predefined risk and fixed targets.
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, accent = "emerald" }) {
  const color = {
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    violet: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  }[accent];
  return (
    <div className={`rounded-lg p-4 border ${color}`}>
      <p className="text-xs uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
