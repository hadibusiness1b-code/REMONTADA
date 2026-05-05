export type PlayerCount = 1 | 2 | 3 | 4;
export type HourlyRates = Record<PlayerCount, number>;

export type InventoryCategory = 'biscuit' | 'chips' | 'cold_drink' | 'hot_drink' | 'other';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  price: number;
  stock: number;
}

export interface OrderItem {
  id: string;
  inventoryItemId?: string; // Optional reference to track inventory deductions
  name: string;
  price: number;
  quantity?: number;
}

export interface SessionLog {
  id: string;
  stationNumber: number | 'outside'; // 'outside' for orders not attached to a station
  startTime: number;
  endTime: number;
  playerCount?: PlayerCount;
  elapsedSeconds?: number;
  gameCost: number;
  orders: OrderItem[];
  foodCost: number;
  totalCost: number;
}
