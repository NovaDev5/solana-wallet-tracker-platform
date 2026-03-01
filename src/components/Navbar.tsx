import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart2,
  Layers,
  Shield,
  Wallet,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Wallets", icon: Activity },
  { to: "/pnl", label: "PnL Checker", icon: BarChart2 },
  { to: "/token-info", label: "Token Info", icon: Layers },
  { to: "/token-snapshot", label: "Token Snapshot", icon: Shield },
  { to: "/portfolio", label: "Portfolio", icon: Wallet },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center h-12 px-4 gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
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
            <span className="font-bold text-sm text-foreground tracking-tight">
              ChainWatch
            </span>
          </Link>

          <div className="flex-1" />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-mono font-medium hidden sm:inline">
              Solana
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[998] bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-[999] w-60 bg-card border-r border-border shadow-lg flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between h-12 px-4 border-b border-border">
                <span className="font-bold text-sm text-foreground">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X size={14} />
                </button>
              </div>

              <button
                onClick={() => {
                  navigate(-1);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-b border-border"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <nav className="flex-1 flex flex-col p-2 gap-0.5 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
