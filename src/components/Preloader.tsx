import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { fetchWalletResponse, fetchWallets } from "../lib/utils";
import { DataContext } from "../context/DataContext";

interface PreloaderProps {
  onComplete: (data: fetchWalletResponse[]) => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing secure connection...");
  const [visible, setVisible] = useState(true);
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");
  const { setApiData } = context;

  useEffect(() => {
    const load = async () => {
      try {
        setStatus("Connecting to backend...");
        setProgress(20);
        const data = await fetchWallets();
        setApiData(data);
        setStatus("Backend Connected");
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          onComplete(data);
        }, 500);
      } catch (err) {
        console.error(err);
        setStatus("Unable to connect to backend");
        setProgress(100);
      }
    };

    load();
  }, [setApiData, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div
            className="mb-8 flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-xl bg-primary opacity-20 animate-pulse" />
              <div className="relative w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 7V12L12 22L20 12V7L12 2Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path d="M12 2L4 7L12 12L20 7L12 2Z" fill="currentColor" />
                  <path
                    d="M4 7V12L12 22V12L4 7Z"
                    fill="currentColor"
                    fillOpacity="0.6"
                  />
                  <path
                    d="M20 7V12L12 22V12L20 7Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">
                ChainWatch
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                SOL Activity Tracker
              </div>
            </div>
          </motion.div>
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span
                className="text-sm font-semibold text-foreground"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {progress}%
              </span>
            </div>

            <svg
              className="animate-spin-slow"
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray={`${progress * 2.26} 226`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground font-mono mb-4">
              {status}
            </p>

            
            <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

        
          <div className="flex gap-2 mt-8">
            {["SOL"].map((net, i) => (
              <motion.div
                key={net}
                className="flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {net}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
