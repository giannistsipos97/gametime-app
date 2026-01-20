export interface GameStoresResponse {
  count: number;
  results: {
    id: number;
    store_id: number;
    url: string;
  }[];
}
