export interface Trade {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  timestamp: string;
  strategy: string;
  pnl?: number;
}

export interface ReflectionResult {
  tradeId: string;
  analysis: string;
  keyLearnings: string[];
  suggestedStrategy?: string;
}
