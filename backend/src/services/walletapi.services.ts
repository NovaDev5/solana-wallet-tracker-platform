const SOLANA_BASE_URL = "https://data.solanatracker.io";

export class WalletService {
  private static async request(endpoint: string): Promise<any> {
    const res = await fetch(`${SOLANA_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.SOLANA_TRACKER_APIKEY || "",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Moralis API Error: ${text}`);
    }
    const data = await res.json();
    return data;
  }

  static async getWalletPortfolio(address: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await this.request(`/wallet/${address}`);
    return data;
  }

  static async getWalletPnL(address: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = this.request(`/pnl/${address}?hideDetails=true`);
    return data;
  }

  static async getWalletPnLChart(address: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await this.request(`/wallet/${address}/chart`);
    return data;
  }

  static async getWalletHistory(address: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await this.request(`/wallet/${address}/trades`);
    return data;
  }

  static async getTokenDetails(tokenaddress: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await this.request(`/tokens/${tokenaddress}`);
    return data
  }

  static async getTokenSnapshots(tokenaddress: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await this.request(
      `/tokens/${tokenaddress}/holders/paginated?limit=5000`,
    );
    return data;
  }
}
