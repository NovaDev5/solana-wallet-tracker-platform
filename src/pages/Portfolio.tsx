import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { WalletPortfolio, fetchWalletPortfolio } from "@/lib/utils";
import { Search, Loader2, AlertCircle } from "lucide-react";

export default function Portfolio() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<WalletPortfolio | null>();
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a wallet address.");
      return;
    }
    setLoading(true);
    const portfolio = await fetchWalletPortfolio(trimmed);
    setPortfolio(portfolio);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <div>
            <h1 className="text-base font-bold text-foreground">
              Wallet Portfolio
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              View all tokens in a Solana wallet
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Solana wallet address..."
                className="flex-1 min-w-0 font-mono text-xs sm:text-sm px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
                {loading ? "Loading..." : "View"}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive mt-2">
                <AlertCircle size={12} />
                {error}
              </div>
            )}
          </div>

          <AnimatePresence>
            {portfolio && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Portfolio Value
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    $
                    {portfolio.walletportfoliousd}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {portfolio.totaltokens} tokens
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="data-table w-full min-w-[500px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th>Token</th>
                          <th>Amount</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.tokens.map((token, i) => {
                          return (
                            <motion.tr
                              key={token.tokenname}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.03 }}
                            >
                              <td>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {token.tokensymbol.slice(0, 2)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-foreground">
                                      {token.tokensymbol}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      {token.tokenname}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="font-mono text-xs">
                                {token.tokenamount}
                              </td>
                              <td className="font-mono text-xs font-medium">
                                {token.tokenvalue}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
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