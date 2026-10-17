import { AnalysisResponse } from "./types";

export const SAMPLE_FALLBACK_ANALYSIS: AnalysisResponse = {
  product_query: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
  forecast: {
    predicted_stockout_days: 2.1,
    current_inventory: 14,
    sales_velocity_7d: 46,
    risk_level: "Immediate",
  },
  competitors: [
    {
      title: "Sony WH-1000XM5 Wireless Headphones - Black Edition",
      price: 398.00,
      source: "Amazon",
      in_stock: true,
      rating: 4.6,
    },
    {
      title: "Sony WH-1000XM5 Premium Noise Canceling (Official)",
      price: 399.99,
      source: "Best Buy",
      in_stock: false, // Critical competitor stockout
      rating: 4.5,
    },
    {
      title: "Sony Over-Ear WH1000XM5 Bluetooth Headset",
      price: 389.99,
      source: "Walmart",
      in_stock: false, // Competitor stockout
      rating: 4.3,
    },
    {
      title: "Sony WH-1000XM5 Wireless Headphones (Silver)",
      price: 399.00,
      source: "Target",
      in_stock: true,
      rating: 4.7,
    },
    {
      title: "Sony WH-1000XM5 Top Rated Seller Bundle",
      price: 419.00,
      source: "B&H Photo Video",
      in_stock: false,
      rating: 4.8,
    },
  ],
  strategy: {
    suggested_price_delta_percent: 15.0,
    new_suggested_price: 458.85,
    ad_headlines: [
      "In Stock Now - Ships Today",
      "Official Sony Guarantee",
      "Skip The Sold Out Queues",
    ],
    action_steps: [
      "Surge list price by +15.0% to $458.85 immediately to capture Buy Box demand during Best Buy and Walmart stockouts.",
      "Increase Google Shopping PPC ad budget by 35% targeting competitor out-of-stock search terms.",
      "Trigger priority supplier PO for 100 units to prevent our own stockout in 2.1 days.",
    ],
    spoken_script:
      "Good morning merchant. ShelfSense telemetry confirms Best Buy and Walmart are officially out of stock on Sony XM5 headphones. TabPFN models forecast your remaining fourteen units will deplete in two point one days. Surge your list price fifteen percent to four hundred fifty-eight dollars and eighty-five cents, and accelerate ad spend immediately.",
  },
  audio_url: "/audio/sample_brief.mp3",
};
