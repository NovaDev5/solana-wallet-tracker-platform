import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAppData } from "@/App";
import { WalletPNL, WalletTrade } from "@/lib/utils";
import {
  fetchWalletDetails,
  WalletTransactions,
} from "@/lib/utils";
import {
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const mapTradeData = (transactions: WalletTransactions[]): WalletTrade[] => {
  return transactions.map((tx, index) => ({
    id: `${index}`,
    type: tx.tradeaction,
    tokenSymbol: tx.tokensymbol,
    tokenName: tx.tokenname,
    amount: tx.tokenamount,
    price: tx.tokenprice,
    totalValue: tx.tokenvalue,
    timestamp: tx.transactiontime,
    txHash: tx.transactionhash,
  }));
};

export default function WalletDetail() {
  const { address } = useParams<{ address: string }>();
  const { data: appData } = useAppData();
  const wallet = appData?.find((w) => w.walletaddress === address);
  const [loading, setLoading] = useState(true);
  const [pnl, setPnl] = useState<WalletPNL>();
  const [trades, setTrades] = useState<WalletTrade[]>([]);
  const [copied, setCopied] = useState(false);
  const load = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const walletDetails = await fetchWalletDetails(address);
      const pnlData = walletDetails.walletpnl;
      const historyData = walletDetails.wallettransactions;
      const walletpnldata: WalletPNL = {
        walletaddress: address,
        totalinvested: pnlData.totalinvested,
        totalpnl: pnlData.totalpnl,
        pnlpositive: pnlData.pnlpositive,
        realizedpnl: pnlData.realizedpnl,
        unrealizedpnl: pnlData.unrealizedpnl,
        totalwins: pnlData.totalwins,
        totallosses: pnlData.totallosses,
        averagebuyamount: pnlData.averagebuyamount,
        winpercentage: pnlData.winpercentage,
        losspercentage: pnlData.losspercentage,
        neutralizedpercentage: pnlData.neutralizedpercentage,
        portfoliopercentagechange: pnlData.portfoliopercentagechange,
        porfoliopnlusdvalue: pnlData.porfoliopnlusdvalue,
      };
      setPnl(walletpnldata);
      const mappedTrades = mapTradeData(historyData);
      setTrades(mappedTrades);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [address, wallet]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const label = wallet?.walletname || "Unknown Wallet";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-xl px-8 py-6 flex flex-col items-center gap-3 shadow-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              <Loader2 size={28} className="text-primary animate-spin" />
              <p className="text-sm font-semibold text-foreground">
                Loading wallet data
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {truncateAddress(address || "")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-base font-bold text-foreground">{label}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="address-text text-muted-foreground">
                  {address}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={11} />
                </button>
                <a
                  href={`https://solscan.io/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink size={11} />
                </a>
                {copied && (
                  <span className="text-[10px] text-success">Copied!</span>
                )}
              </div>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/60 disabled:opacity-60 disabled:cursor-not-allowed bg-card"
            >
              {loading && (
                <Loader2 size={12} className="animate-spin text-primary" />
              )}
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            >
              {[
                { label: "Total PnL", value: pnl.totalpnl, highlight: true },
                { label: "Realized", value: pnl.realizedpnl, highlight: true },
                {
                  label: "Unrealized",
                  value: pnl.unrealizedpnl,
                  highlight: true,
                },
                {
                  label: "Total Invested",
                  value: pnl.totalinvested,
                  highlight: false,
                },
                {
                  label: "Average Buy Amount",
                  value: pnl.averagebuyamount,
                  highlight: false,
                },
                {
                  label: "Total Wins",
                  value: String(pnl.totalwins),
                  highlight: false,
                },
                {
                  label: "Total Losses",
                  value: String(pnl.totallosses),
                  highlight: false,
                },
                {
                  label: "Win Percentage ",
                  value: pnl.winpercentage,
                  highlight: false,
                },
                {
                  label: "Loss Percentage ",
                  value: pnl.losspercentage,
                  highlight: false,
                },
                {
                  label: "Neutral Percentage ",
                  value: pnl.neutralizedpercentage,
                  highlight: false,
                },
                {
                  label: "PnL USD Value",
                  value: pnl.porfoliopnlusdvalue,
                  highlight: true,
                },
                {
                  label: "PnL %",
                  value: pnl.portfoliopercentagechange,
                  highlight: true,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-card border border-border rounded-lg p-3"
                >
                  <div className="text-[10px] text-muted-foreground mb-1">
                    {card.label}
                  </div>
                  <div
                    className={`text-sm font-bold ${card.highlight ? (pnl.pnlpositive ? "text-success" : "text-destructive") : "text-foreground"}`}
                  >
                    {card.value}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!loading && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">
                  Trade History
                </h2>
                <span className="text-xs text-muted-foreground">
                  {trades.length} trades
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-muted/50">
                      <th>Type</th>
                      <th>Token</th>
                      <th>Amount</th>
                      <th>Price</th>
                      <th>Value</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade, i) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td>
                          <span
                            className={
                              trade.type === "BUY"
                                ? "tag-positive"
                                : "tag-negative"
                            }
                          >
                            {trade.type}
                          </span>
                        </td>
                        <td>
                          <div className="text-xs font-medium text-foreground">
                            {trade.tokenSymbol}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {trade.tokenName}
                          </div>
                        </td>
                        <td className="font-mono text-xs">{trade.amount}</td>
                        <td className="font-mono text-xs">{trade.price}</td>
                        <td className="font-mono text-xs font-medium">
                          {trade.totalValue}
                        </td>
                        <td className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(trade.timestamp)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
