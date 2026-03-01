import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TokenInfo, fetchTokenDetails } from "@/lib/utils";
import { Search, Loader2, AlertCircle, Copy, Flame } from "lucide-react";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export default function TokenDetails() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [TokenData, setTokenData] = useState<TokenInfo | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter a token address.");
      return;
    }
    setLoading(true);
    setTokenData(null);
    const TokenDetails = await fetchTokenDetails(trimmed);
    setTokenData(TokenDetails);
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <div>
            <h1 className="text-base font-bold text-foreground">
              Token Information
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Check details for any SPL token on Solana
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
            {TokenData && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {TokenData.tokensymbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-foreground">
                          {TokenData.tokenname}
                        </h2>
                        <span className="tag-neutral">
                          {TokenData.tokensymbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="address-text text-muted-foreground">
                          {truncateAddress(TokenData.tokenaddress)}
                        </span>
                        <button
                          onClick={() => handleCopy(TokenData.tokenaddress)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy size={10} />
                        </button>
                        {copied && (
                          <span className="text-[10px] text-success">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      {
                        label: " Total Supply in Pool",
                        value: Number(TokenData.totalsupply).toFixed(0),
                        mono: true,
                      },
                      { label: "Token Holders", value: TokenData.tokenholders },
                      {
                        label: "Token Liquidity (USD)",
                        value: TokenData.tokenliquidityusd,
                      },
                      {
                        label: "Token Price (USD)",
                        value: TokenData.tokenpriceusd,
                      },
                      {
                        label: "Total Trades",
                        value: TokenData.totaltrades,
                      },
                      {
                        label: "Buy Trades",
                        value: TokenData.buytrades,
                      },
                      {
                        label: "Sell Trades",
                        value: TokenData.selltrades,
                      },
                      { label: "Market", value: TokenData.tokenmarket },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 bg-muted/40 rounded-md"
                      >
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          {item.label}
                        </div>
                        <div
                          className={`text-sm font-semibold text-foreground ${item.mono ? "font-mono" : ""}`}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="text-[10px] text-muted-foreground mb-0.5">
                        Burns
                      </div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-1">
                        <Flame size={12} className="text-warning" />
                        {TokenData.tokenburns}
                      </div>
                    </div>
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
