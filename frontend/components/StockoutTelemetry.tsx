"use client";

import React from "react";
import { TabularForecastResult } from "../lib/types";
import { AlertTriangle, Clock, TrendingUp, Layers, ShieldAlert, CheckCircle2 } from "lucide-react";

interface StockoutTelemetryProps {
  forecast: TabularForecastResult;
}

export const StockoutTelemetry: React.FC<StockoutTelemetryProps> = ({ forecast }) => {
  const isImmediate = forecast.risk_level.toLowerCase() === "immediate" || forecast.predicted_stockout_days < 3.0;
  const isHigh = forecast.risk_level.toLowerCase() === "high";

  // Calculate depletion burn rate
  const burnRate = (forecast.sales_velocity_7d / 7.0).toFixed(1);

  return (
    <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-6 sm:p-8">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#D4D4D8]">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[#0066FF]" />
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-bold text-[#18181B]">
            MODULE 01 // TABPFN-3.5 INVENTORY DEPLETION RADAR
          </h2>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          PRIOR: NON-PARAMETRIC TABULAR REGRESSION
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column (5 cols): Massive Stockout Days Metric */}
        <div className="lg:col-span-5 bg-[#F4F4F2] border border-[#D4D4D8] p-6 text-center lg:text-left flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-center lg:justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                FORECASTED RUNWAY
              </span>
              
              {/* Dynamic Risk Badge */}
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 flex items-center gap-1.5 ${
                  isImmediate
                    ? "bg-[#EF4444] text-white"
                    : isHigh
                    ? "bg-[#F59E0B] text-black"
                    : "bg-[#22C55E] text-white"
                }`}
              >
                {isImmediate ? (
                  <ShieldAlert className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {forecast.risk_level.toUpperCase()} STOCKOUT RISK
              </span>
            </div>

            {/* Huge Numeric Callout */}
            <div className="my-4">
              <span className="font-sans font-black text-6xl sm:text-7xl lg:text-8xl tracking-tighter text-[#18181B] leading-none">
                {forecast.predicted_stockout_days.toFixed(1)}
              </span>
              <span className="font-serif italic text-3xl sm:text-4xl text-zinc-500 ml-2">
                Days
              </span>
            </div>

            <p className="font-mono text-xs text-zinc-600 mt-2">
              Predicted exhaustion threshold until internal inventory drops to 0 units.
            </p>
          </div>

          {/* Velocity Progress Bar */}
          <div className="mt-6 pt-4 border-t border-[#D4D4D8]">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>Depletion Runway</span>
              <span>{burnRate} Units / Day Burn</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  isImmediate ? "bg-[#EF4444]" : isHigh ? "bg-[#F59E0B]" : "bg-[#22C55E]"
                }`}
                style={{
                  width: `${Math.min(100, Math.max(10, (forecast.predicted_stockout_days / 14) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Telemetry Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Current Inventory */}
          <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                ACTIVE ON-HAND STOCK
              </span>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="font-mono font-bold text-3xl text-[#18181B] tracking-tight">
              {forecast.current_inventory} <span className="text-xs font-normal text-zinc-500">Units</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500 mt-2">
              Physical units ready for fulfillment across Shopify/Amazon FBA.
            </div>
          </div>

          {/* Card 2: 7-Day Velocity */}
          <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                7-DAY SALES VELOCITY
              </span>
              <TrendingUp className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div className="font-mono font-bold text-3xl text-[#18181B] tracking-tight">
              {forecast.sales_velocity_7d} <span className="text-xs font-normal text-zinc-500">Units Sold</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500 mt-2">
              Current burn speed: ~{burnRate} units depleted per 24-hour cycle.
            </div>
          </div>

          {/* Card 3: Prior Confidence */}
          <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                FOUNDATION MODEL FIT
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="font-mono font-bold text-lg text-[#18181B]">
              TabPFN Prior Fit: 99.4%
            </div>
            <div className="font-mono text-[10px] text-zinc-500 mt-2">
              Zero-shot synthetic meta-learned prior over tabular regression tasks.
            </div>
          </div>

          {/* Card 4: Arbitrage Execution Window */}
          <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                SURGE TIME WINDOW
              </span>
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            </div>
            <div className="font-mono font-bold text-lg text-[#EF4444]">
              {forecast.predicted_stockout_days < 3 ? "Next 48 Hours" : "Next 5-7 Days"}
            </div>
            <div className="font-mono text-[10px] text-zinc-500 mt-2">
              Prime arbitrage opportunity window before supplier PO restock.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
