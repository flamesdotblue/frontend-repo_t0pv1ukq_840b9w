import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import CodeBlock from "./components/CodeBlock";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      <Header />
      <Hero />
      <FeatureGrid />
      <CodeBlock />
      <footer className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-400">
        Built for disciplined traders. Capital preservation first; growth follows process.
      </footer>
    </div>
  );
}
