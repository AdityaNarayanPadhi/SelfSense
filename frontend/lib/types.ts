export interface CompetitorItem {
  title: string;
  price: number;
  source: string;
  in_stock: boolean;
  rating?: number | null;
}

export interface TabularForecastResult {
  predicted_stockout_days: number;
  current_inventory: number;
  sales_velocity_7d: number;
  risk_level: "Immediate" | "High" | "Moderate" | "Low" | string;
}

export interface ArbitrageStrategy {
  suggested_price_delta_percent: number;
  new_suggested_price: number;
  ad_headlines: string[];
  action_steps: string[];
  spoken_script: string;
}

export interface AnalysisResponse {
  product_query: string;
  forecast: TabularForecastResult;
  competitors: CompetitorItem[];
  strategy: ArbitrageStrategy;
  audio_url: string;
}
