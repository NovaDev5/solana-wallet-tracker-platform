import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    title: "Wallet Tracking",
    desc: "Monitor any Solana wallet's activity and PnL in real-time.",
  },
  {
    title: "PnL Analytics",
    desc: "Analyze profit & loss with realized vs unrealized breakdown.",
  },
  {
    title: "Token Insights",
    desc: "Deep dive into any SPL token — supply, trades, liquidity, and score.",
  },
  {
    title: "Portfolio View",
    desc: "See all tokens in a wallet with live prices and USD values.",
  },
  {
    title: "Honeypot Detection",
    desc: "Token scoring to identify potential honeypots and rug pulls.",
  },
  {
    title: "Trade History",
    desc: "Full trade history showing buy/sell activity for any tracked wallet.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-12 px-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 7V12L12 22L20 12V7L12 2Z"
                  fill="currentColor"
                  fillOpacity="0.3"
                />
                <path d="M12 2L4 7L12 12L20 7L12 2Z" fill="currentColor" />
                <path
                  d="M4 7V12L12 22V12L4 7Z"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight">ChainWatch</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Launch App
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-12 min-h-screen flex items-center bg-background">
        <div className="relative w-full px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live on Solana Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
            >
              Track Every Move on
              <br />
              <span className="text-primary">Solana</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-base mb-8 max-w-xl mx-auto"
            >
              Professional wallet monitoring, PnL analytics, token scoring, and
              portfolio insights for Solana traders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Open Dashboard
              </Link>
              <Link
                to="/pnl"
                className="flex items-center gap-2 bg-card border border-border text-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-muted transition-colors"
              >
                Check PnL
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-sm">
              Professional-grade Solana analysis tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-5 px-6 border-t border-border bg-background">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <span className="text-xs font-bold text-foreground">ChainWatch</span>
          <p className="text-xs text-muted-foreground">
            Solana Wallet Tracker — For informational purposes only.
          </p>
          <span className="text-xs font-mono text-muted-foreground">SOL</span>
        </div>
      </footer>
    </div>
  );
}
