import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TokenSnapshot, fetchTokenSnapshot } from "@/lib/utils";
import { Search, Download, Loader2, AlertCircle, Copy } from "lucide-react";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export default function TokenSnapshotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenSnapshot>();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const trimmed = input.trim();
      if (!trimmed) {
        setError("Please enter a token address or symbol.");
        return;
      }
      setLoading(true);
      const TokenSnapshot = await fetchTokenSnapshot(trimmed);
      setTokenData(TokenSnapshot);
      setLoading(false);
    } catch (error) {
      setError("Error fetching token snapshot: ");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDownload = () => {
    if (!tokenData) return;
    const data = {
      token: { address: tokenData.tokenaddress },
      holders: tokenData.holders.map((h) => ({
        tokenaccountaddress: h.tokenaccount,
        tokenamount: h.tokenamount,
        tokenusdvalue: h.tokenusdvalue,
        tokenpercentageheld: h.tokenpercentageheld,
      })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tokenData.tokenaddress}_holders.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <div>
            <h1 className="text-base font-bold text-foreground">
              Token Snapshot
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              View holders and distribution for any token
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Token address..."
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
                {loading ? "Loading..." : "Search"}
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
            {tokenData && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-bold text-foreground mb-1">
                        Token
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <span className="address-text text-muted-foreground">
                          {truncateAddress(tokenData.tokenaddress)}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(tokenData.tokenaddress, "address")
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy size={10} />
                        </button>
                        {copied === "address" && (
                          <span className="text-[10px] text-success">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-foreground">
                        {tokenData.totalholders}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total holders
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Holders
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Wallets holding this token
                      </p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Download size={12} />
                      Export JSON
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="data-table w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-muted/50">
                          <th>#</th>
                          <th>Wallet Address</th>
                          <th>Token Account</th>
                          <th>Amount</th>
                          <th>USD Value</th>
                          <th>% Held</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tokenData.holders.map((holder, i) => {
                          const pct = parseFloat(holder.tokenpercentageheld);
                          return (
                            <motion.tr
                              key={`${holder.walletaddress}-${holder.tokenaccount}-${i}`}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="font-mono text-muted-foreground">
                                {i + 1}
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <a
                                    href={`https://solscan.io/account/${holder.walletaddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="address-text text-primary hover:underline"
                                  >
                                    {truncateAddress(holder.walletaddress)}
                                  </a>
                                  <button
                                    onClick={() =>
                                      handleCopy(holder.walletaddress, `h${i}`)
                                    }
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <Copy size={9} />
                                  </button>
                                  {copied === `h${i}` && (
                                    <span className="text-[9px] text-success">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="font-mono text-xs">
                                {truncateAddress(holder.tokenaccount)}
                              </td>
                              <td className="font-mono text-xs font-medium">
                                {holder.tokenamount}
                              </td>
                              <td className="font-mono text-xs">
                                {holder.tokenusdvalue}
                              </td>
                              <td className="min-w-[120px]">
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div
                                    className="h-1.5 bg-primary rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(pct, 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="mt-1 text-[10px] text-muted-foreground">
                                  {holder.tokenpercentageheld}
                                </div>
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
