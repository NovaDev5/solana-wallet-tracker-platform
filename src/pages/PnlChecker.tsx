import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { WalletPNL, fetchWalletPNL } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
} from "lucide-react";


export default function PnlChecker() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletpnl, setWalletpnl] = useState<WalletPNL | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a wallet address.");
      return;
    }
    if (trimmed.length < 32 || trimmed.length > 44) {
      setError("Invalid Solana wallet address.");
      return;
    }
    setLoading(true);
   const walletpnl = await fetchWalletPNL(trimmed)
   setWalletpnl(walletpnl)
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <div>
            <h1 className="text-base font-bold text-foreground">PnL Checker</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyze profit & loss for any Solana wallet
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Wallet Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="Enter Solana wallet address..."
                className="w-full font-mono text-sm px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle size={12} />
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Check PnL
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {walletpnl && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Wallet
                  </div>
                  <div className="font-mono text-xs text-foreground break-all mb-4">
                    {walletpnl.walletaddress}
                  </div>
                  <div className="text-center py-4 border-y border-border">
                    <div
                      className={`text-3xl font-bold mb-1 ${walletpnl.pnlpositive ? "text-success" : "text-destructive"}`}
                    >
                      {walletpnl.totalpnl}
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 text-sm ${walletpnl.pnlpositive ? "text-success" : "text-destructive"}`}
                    >
                      {walletpnl.pnlpositive ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {walletpnl.portfoliopercentagechange}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total PnL
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <div
                        className={`text-base font-bold ${walletpnl.pnlpositive ? "text-success" : "text-destructive"}`}
                      >
                        {walletpnl.realizedpnl}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Realized
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <div
                        className={`text-base font-bold ${walletpnl.pnlpositive ? "text-success" : "text-destructive"}`}
                      >
                        {walletpnl.unrealizedpnl}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Unrealized
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-3">
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total Invested", value: walletpnl.totalinvested },
                      { label: "Average Buy", value: walletpnl.averagebuyamount },
                      {
                        label: "Wins",
                        value: String(walletpnl.totalwins),
                        positive: true,
                      },
                      {
                        label: "Losses",
                        value: String(walletpnl.totallosses),
                        negative: true,
                      },
                      {
                        label: "Win %",
                        value: walletpnl.winpercentage,
                        positive: true,
                      },
                      {
                        label: "Loss %",
                        value: walletpnl.losspercentage,
                        negative: true,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="p-2.5 bg-muted/40 rounded-md"
                      >
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          {s.label}
                        </div>
                        <div
                          className={`text-sm font-semibold ${s.positive ? "text-success" : s.negative ? "text-destructive" : "text-foreground"}`}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
