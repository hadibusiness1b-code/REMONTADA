export type PlayerCount = 1 | 2 | 3 | 4;
export type HourlyRates = Record<PlayerCount, number>;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
}

export interface SessionLog {
  id: string;
  stationNumber: number;
  startTime: number;
  endTime: number;
  playerCount: PlayerCount;
  elapsedSeconds: number;
  gameCost: number;
  orders: OrderItem[];
  foodCost: number;
  totalCost: number;
}
