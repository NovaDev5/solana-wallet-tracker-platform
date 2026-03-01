import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { WalletService } from "../services/walletapi.services";
import { walletList } from "../config/walletlist";

export interface fetchWalletResponse {
  walletaddress: string;
  walletname: string;
  totalinvested: string;
  positive: boolean;
  avatar: string;
  totalpnl: string;
  realizedpnl: string;
  unrealizedpnl: string;
}

interface WalletPNL {
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

interface WalletTransactions {
  transactionhash: string;
  tradeaction: string;
  tokenname: string;
  tokensymbol: string;
  tokenamount: string;
  tokenprice: string;
  tokenvalue: string;
  transactiontime: any;
}

interface TokenInfo {
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

interface Walletdetails {
  walletpnl: WalletPNL;
  wallettransactions: WalletTransactions[];
}

interface NewWallet {
  walletaddress: string;
  walletname: string;
  avatar: string;
}

interface PortfolioTokens {
  tokenname: string;
  tokensymbol: string;
  tokenamount: string;
  tokenvalue: string;
}

interface Tokenholders {
  walletaddress: string;
  tokenaccount: string;
  tokenamount: string;
  tokenusdvalue: string;
  tokenpercentageheld: string;
}

interface TokenSnapshot {
  tokenaddress: string;
  totalholders: number;
  holders: Tokenholders[];
}

interface WalletPortfolio {
  walletaddress: string;
  walletportfoliousd: string;
  totaltokens: number;
  tokens: PortfolioTokens[];
}

export class WalletController {
  static async serverping(req: Request, res: Response) {
    try {
      console.log("server is active and running");
      res.status(200).json({ status: "OK" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async pnl(req: Request, res: Response) {
    try {
      const { address } = req.query;
      const walletInfo = await WalletService.getWalletPnL(address as string);
      const walletpnl_chart = await WalletService.getWalletPnLChart(
        address as string,
      );
      const data: WalletPNL = {
        walletaddress: address as string,
        totalpnl: Number(walletInfo.summary.total).toFixed(2),
        pnlpositive: walletInfo.summary.total > 0 ? true : false,
        totalinvested: Number(walletInfo.summary.totalInvested).toFixed(2),
        realizedpnl: Number(walletInfo.summary.realized).toFixed(2),
        unrealizedpnl: Number(walletInfo.summary.unrealized).toFixed(2),
        totalwins: walletInfo.summary.totalWins || 0,
        totallosses: walletInfo.summary.totalLosses || 0,
        averagebuyamount: Number(walletInfo.summary.averageBuyAmount).toFixed(
          2,
        ),
        winpercentage: walletInfo.summary.winPercentage || 0,
        losspercentage: walletInfo.summary.lossPercentage || 0,
        neutralizedpercentage: walletInfo.summary.neutralPercentage || 0,
        portfoliopercentagechange: walletpnl_chart.pnl?.["30d"].value || 0,
        porfoliopnlusdvalue: walletpnl_chart.pnl?.["30d"].percentage || 0,
      };
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "PnL error" });
    }
  }

  static async walletportfolio(req: Request, res: Response) {
    try {
      const { address } = req.query;
      const walletInfo = await WalletService.getWalletPortfolio(
        address as string,
      );
      const PortfolioTokenList: PortfolioTokens[] = [];
      const portfoliototalusd = Number(walletInfo.total).toFixed(2);
      const walletTokens = walletInfo.tokens;
      for (const tokendata of walletTokens) {
        const token = tokendata.token;
        const tokenInfo: PortfolioTokens = {
          tokenname: token.name,
          tokensymbol: token.symbol,
          tokenamount: Number(tokendata.balance).toFixed(2),
          tokenvalue: Number(tokendata.value).toFixed(2),
        };
        PortfolioTokenList.push(tokenInfo);
      }
      const WalletPortfolio: WalletPortfolio = {
        walletaddress: address as string,
        walletportfoliousd: portfoliototalusd,
        totaltokens: walletTokens.length,
        tokens: PortfolioTokenList,
      };
      res.json(WalletPortfolio);
    } catch (error) {
      res.status(500).json({ error: "PnL error" });
    }
  }

  static async walletdetails(req: Request, res: Response) {
    try {
      const { address } = req.query;
      const walletTransaction: WalletTransactions[] = [];
      const walletInfo = await WalletService.getWalletPnL(address as string);
      const walletpnl_chart = await WalletService.getWalletPnLChart(
        address as string,
      );
      const data = await WalletService.getWalletHistory(address as string);
      const trades = data.trades;
      const walletpnls: WalletPNL = {
        walletaddress: address as string,
        totalpnl: Number(walletInfo.summary.total).toFixed(2),
        pnlpositive: walletInfo.summary.total > 0 ? true : false,
        totalinvested: Number(walletInfo.summary.totalInvested).toFixed(2),
        realizedpnl: Number(walletInfo.summary.realized).toFixed(2),
        unrealizedpnl: Number(walletInfo.summary.unrealized).toFixed(2),
        totalwins: walletInfo.summary.totalWins || 0,
        totallosses: walletInfo.summary.totalLosses || 0,
        averagebuyamount: Number(walletInfo.summary.averageBuyAmount).toFixed(
          2,
        ),
        winpercentage: walletInfo.summary.winPercentage || 0,
        losspercentage: walletInfo.summary.lossPercentage || 0,
        neutralizedpercentage: walletInfo.summary.neutralPercentage || 0,
        portfoliopercentagechange: walletpnl_chart.pnl?.["30d"].value || 0,
        porfoliopnlusdvalue: walletpnl_chart.pnl?.["30d"].percentage || 0,
      };
      for (const tx of trades) {
        const buyaction =
          tx.from.address === "So11111111111111111111111111111111111111112"
            ? true
            : false;
        const sellaction =
          tx.to.address === "So11111111111111111111111111111111111111112"
            ? true
            : false;
        walletTransaction.push({
          transactionhash: tx.hash,
          tradeaction: buyaction === true ? "BUY" : " SELL",
          tokenname: buyaction === true ? tx.to.token.name : tx.from.token.name,
          tokensymbol:
            buyaction === true ? tx.to.token.symbol : tx.from.token.symbol,
          tokenamount: buyaction === true ? tx.to.amount : tx.from.amount,
          tokenprice: Number(tx.price.usd).toFixed(7),
          tokenvalue: Number(tx.volume.usd).toFixed(7),
          transactiontime: new Date(tx.time),
        });
      }
      const walletdata: Walletdetails = {
        walletpnl: walletpnls,
        wallettransactions: walletTransaction,
      };
      res.json(walletdata);
    } catch (error) {
      res.status(500).json({ error: "History error" });
    }
  }

  static async tokensnapshots(req: Request, res: Response) {
    try {
      const { tokenaddress } = req.query;
      const data = await WalletService.getTokenSnapshots(
        tokenaddress as string,
      );
      const tokentotalholders = data.total;
      const tokenholdrslist = data.accounts;
      const tokenholders: Tokenholders[] = [];
      for (const holders of tokenholdrslist) {
        const tokenholdersdata: Tokenholders = {
          walletaddress: holders.wallet,
          tokenaccount: holders.account,
          tokenamount: Number(holders.amount).toFixed(2),
          tokenusdvalue: Number(holders.value.usd).toFixed(2),
          tokenpercentageheld: Number(holders.percentage).toFixed(4),
        };
        tokenholders.push(tokenholdersdata);
      }
      const tokenSnapshot: TokenSnapshot = {
        tokenaddress: tokenaddress as string,
        totalholders: tokentotalholders,
        holders: tokenholders,
      };
      res.json(tokenSnapshot);
    } catch (error) {
      res.status(500).json({ error: "Snapshots error" });
    }
  }

  static async tokendetails(req: Request, res: Response) {
    try {
      const { tokenaddress } = req.query;
      const data = await WalletService.getTokenDetails(tokenaddress as string);
      const tokendata = data.token;
      const tokenpooldata = data.pools[0];
      const TokenDetails: TokenInfo = {
        tokenaddress: tokenaddress as string,
        tokenname: tokendata.name,
        tokensymbol: tokendata.symbol,
        totalsupply: tokenpooldata.tokenSupply,
        tokenholders: data.holders,
        tokenliquidityusd: Number(tokenpooldata.liquidity.usd).toFixed(2),
        tokenpriceusd: Number(tokenpooldata.price.usd).toFixed(8),
        totaltrades: data.txns,
        buytrades: data.buys,
        selltrades: data.sells,
        tokenmarket: tokenpooldata.market,
        tokenburns: tokenpooldata.lpBurn,
      };
      console.log(TokenDetails);
      res.json(TokenDetails);
    } catch (error) {
      res.status(500).json({ error: "Token details error" });
    }
  }

  static async getWalletList(req: Request, res: Response) {
    try {
      const walletpnlList: fetchWalletResponse[] = [];
      for (const wallet of walletList) {
        const walletInfo = await WalletService.getWalletPnL(
          wallet.walletaddress,
        );
        const data = {
          walletaddress: wallet.walletaddress,
          walletname: wallet.walletname,
          totalinvested: Number(walletInfo.summary.totalInvested).toFixed(2),
          positive: walletInfo.summary.total > 0 ? true : false,
          avatar: wallet.avatar,
          totalpnl: Number(walletInfo.summary.total).toFixed(2),
          realizedpnl: Number(walletInfo.summary.realized).toFixed(2),
          unrealizedpnl: Number(walletInfo.summary.unrealized).toFixed(2),
        };
        walletpnlList.push(data);
      }
      res.json(walletpnlList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet list" });
    }
  }

  static async addWallet(req: Request, res: Response) {
    try {
      const { walletaddress, walletname, avatar } = req.query;
      const walletetails: NewWallet = {
        walletaddress: walletaddress as string,
        walletname: walletname as string,
        avatar: avatar as string,
      };
      const filePath = path.join(__dirname, "../config/walletlist.ts");
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let walletString = JSON.stringify(walletetails, null, 2);
      walletString = walletString.replace(/"([^"]+)":/g, "$1:");
      walletString = walletString + ",\n";
      const insertPosition = fileContent.lastIndexOf("]");
      const newContent =
        fileContent.slice(0, insertPosition) +
        walletString +
        fileContent.slice(insertPosition);

      fs.writeFileSync(filePath, newContent, "utf-8");
      res.json({ message: "Wallet added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add wallet" });
    }
  }
}
