import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AddWallets } from "@/lib/utils";
import { DataContext } from "@/context/DataContext";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export default function Dashboard() {
  const { apiData } = useContext(DataContext);
  if (!apiData) console.log("Dashboard: No API data available");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newwalletname, setnewwalletname] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addingWallet, setAddingWallet] = useState(false);
  const [wallets, setWallets] = useState(apiData || []);

  const handleAddWallet = async () => {
    const trimmed = newAddress.trim();
    if (!trimmed) return;

    setAddingWallet(true);
    try {
      const avatar =
        newwalletname.slice(0, 2).toUpperCase() ||
        trimmed.slice(0, 2).toUpperCase();
      await AddWallets(trimmed, newwalletname, avatar);
      setNewAddress("");
      setnewwalletname("");
      setShowAdd(false);
    } catch (error) {
      console.error("Error adding wallet:", error);
    } finally {
      setAddingWallet(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-foreground">
                Tracked Wallets
              </h1>
              <p className="text-xs text-muted-foreground">
                Select a wallet to view full PnL & trade history
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={12} />
              Add Wallet
            </button>
          </div>

          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Solana wallet address..."
                  className="font-mono text-sm px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  value={newwalletname}
                  onChange={(e) => setnewwalletname(e.target.value)}
                  placeholder="Avatar"
                  maxLength={2}
                  className="text-sm px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground text-center uppercase"
                />
                <button
                  onClick={handleAddWallet}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}

          <div className="relative">
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search wallets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            {wallets.map((wallet, i) => {
              const positive = wallet.positive;
              return (
                <motion.button
                  key={wallet.walletname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/wallet/${wallet.walletaddress}`)}
                  className="w-full text-left bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary shrink-0 mt-0.5 sm:mt-0">
                      {wallet.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-foreground">
                          {wallet.walletname}
                        </span>
                        <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">
                          {truncateAddress(wallet.walletaddress)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          Real:{" "}
                          <span
                            className={
                              positive ? "text-success" : "text-destructive"
                            }
                          >
                            {wallet.realizedpnl}
                          </span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          Unreal:{" "}
                          <span
                            className={
                              positive ? "text-success" : "text-destructive"
                            }
                          >
                            {wallet.unrealizedpnl}
                          </span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          TotalInvested:{" "}
                          <span
                            className={`font-semibold ${positive ? "text-success" : "text-destructive"}`}
                          >
                            {wallet.totalinvested}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span
                        className={`text-[10px] sm:text-xs ${positive ? "tag-positive" : "tag-negative"}`}
                      >
                        {positive ? (
                          <TrendingUp size={9} className="inline mr-0.5" />
                        ) : (
                          <TrendingDown size={9} className="inline mr-0.5" />
                        )}
                        {wallet.totalpnl}
                      </span>
                      <ChevronRight
                        size={12}
                        className="text-muted-foreground group-hover:text-primary transition-colors hidden sm:block"
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}