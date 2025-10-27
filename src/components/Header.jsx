import { Shield, Rocket } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-b from-zinc-900/70 to-transparent backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-emerald-400/80">Institutional Discipline</p>
            <h1 className="text-lg font-semibold text-white">$50 ➜ $10,000 Growth Strategy</h1>
          </div>
        </div>
        <a
          href="#code"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-900 shadow hover:bg-emerald-400 transition"
        >
          <Rocket size={16} />
          Get the Strategy Code
        </a>
      </div>
    </header>
  );
}
