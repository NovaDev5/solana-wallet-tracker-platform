import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface fetchWalletResponse {
  walletaddress: string;
  walletname: string;
  totalinvested: number;
  positive: boolean;
  avatar: string;
  totalpnl: number;
  realizedpnl: number;
  unrealizedpnl: number;
}

export interface WalletPNL {
  walletaddress: string;
  totalinvested: string;
  totalpnl: string;
  pnlpositive: boolean;
  realizedpnl: string;
  unrealizedpnl: string;
  totalwins: number;
  totallosses: number;
  averagebuyamount: string;
  winpercentage: string;
  losspercentage: string;
  neutralizedpercentage: string;
  portfoliopercentagechange: string;
  porfoliopnlusdvalue: number;
}

export interface WalletTransactions {
  transactionhash: string;
  tradeaction: string;
  tokenname: string;
  tokensymbol: string;
  tokenamount: string;
  tokenprice: string;
  tokenvalue: string;
  transactiontime: any;
}

export interface WalletTrade {
  id: string;
  type: string;
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  price: string;
  totalValue: string;
  timestamp: string;
  txHash: string;
}

export interface TokenInfo {
  tokenaddress: string;
  tokenname: string;
  tokensymbol: string;
  totalsupply: string;
  tokenholders: number;
  tokenliquidityusd: string;
  tokenpriceusd: string;
  totaltrades: number;
  buytrades: number;
  selltrades: number;
  tokenmarket: string;
  tokenburns: number;
}

export interface WalletDetails {
  walletpnl: WalletPNL;
  wallettransactions: WalletTransactions[];
}

interface Tokenholders {
  walletaddress: string;
  tokenaccount: string;
  tokenamount: string;
  tokenusdvalue: string;
  tokenpercentageheld: string;
}

export interface TokenSnapshot {
  tokenaddress: string;
  totalholders: number;
  holders: Tokenholders[];
}

interface PortfolioTokens {
  tokenname: string;
  tokensymbol: string;
  tokenamount: string;
  tokenvalue: string;
}

export interface WalletPortfolio {
  walletaddress: string;
  walletportfoliousd: string;
  totaltokens: number;
  tokens: PortfolioTokens[];
}

const API_BASE_URL =
  "http://localhost:4000/api/wallet";
export const fetchWallets = async (): Promise<fetchWalletResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/walletLists`);
    if (!response.ok) {
      throw new Error("Failed to fetch wallets");
    }
    const data: fetchWalletResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return [];
  }
};

export const fetchWalletPNL = async (
  address: string,
): Promise<WalletPNL | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pnl?address=${address}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pnl");
    }
    const data: WalletPNL = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pnl:", error);
    return null;
  }
};

export const fetchWalletPortfolio = async (
  address: string,
): Promise<WalletPortfolio | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/portfolio?address=${address}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch portfolio");
    }
    const data: WalletPortfolio = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return null;
  }
};

export const fetchWalletDetails = async (
  address: string,
): Promise<WalletDetails> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/walletdetails?address=${address}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch wallet details");
    }
    const data: WalletDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    return;
  }
};

export const fetchTokenDetails = async (
  tokenaddress: string,
): Promise<TokenInfo> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tokendetails?tokenaddress=${tokenaddress}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token details");
    }
    const data: TokenInfo = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token details:", error);
    return;
  }
};

export const fetchTokenSnapshot = async (
  tokenaddress: string,
): Promise<TokenSnapshot> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/snapshots?tokenaddress=${tokenaddress}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token snapshot");
    }
    const data: TokenSnapshot = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token snapshot:", error);
    throw error;
  }
};

export const AddWallets = async (
  walletaddress: string,
  walletname: string,
  avatar: string,
): Promise<string> => {
  try {
    const response = await fetch(
      `
      ${API_BASE_URL}/addwallet?walletaddress=${walletaddress}&walletname=${walletname}&avatar=${avatar}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch wallets");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return;
  }
};
