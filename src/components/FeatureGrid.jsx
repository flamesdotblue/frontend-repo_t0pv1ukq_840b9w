import { Ban, Repeat, Timer, TrendingUp, Boxes, CheckCircle2 } from "lucide-react";

export default function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="Multi-Timeframe Model"
          text="4H defines trend via swing structure. 15M executes retracement into freshly formed order blocks after a confirmed break of structure."
          icon={<TrendingUp className="text-emerald-400" size={20} />}
        />
        <Card
          title="Market Structure Entries"
          text="No lagging oscillators. Entries are triggered only on bar close after BoS; limit orders rest at the identified OB with explicit invalidation."
          icon={<Boxes className="text-emerald-400" size={20} />}
        />
        <Card
          title="Phased Growth Risk"
          text="Risk per trade auto-adjusts with equity: higher at $50 for survival, tapering down as capital grows to protect profits."
          icon={<Timer className="text-emerald-400" size={20} />}
        />
        <Card
          title="Fixed Risk-to-Reward"
          text="Stops sit beyond the OB; targets use a fixed multiple to avoid discretion and over-optimization."
          icon={<CheckCircle2 className="text-emerald-400" size={20} />}
        />
        <Card
          title="No Repainting"
          text="All signals are locked on candle close. MTF data is requested without lookahead. Visuals do not retroactively change."
          icon={<Ban className="text-emerald-400" size={20} />}
        />
        <Card
          title="No Martingale / Grid"
          text="Each trade is independent with predefined risk. No averaging down. No position adds beyond the plan."
          icon={<Repeat className="text-emerald-400" size={20} />}
        />
      </div>
    </section>
  );
}

function Card({ title, text, icon }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-zinc-300">{text}</p>
    </div>
  );
}
