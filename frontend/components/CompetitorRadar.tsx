"use client";

import React from "react";
import { CompetitorItem } from "../lib/types";
import { Radar, ShoppingBag, ExternalLink, Star } from "lucide-react";

interface CompetitorRadarProps {
  competitors: CompetitorItem[];
  suggestedPrice: number;
}

export const CompetitorRadar: React.FC<CompetitorRadarProps> = ({
  competitors,
  suggestedPrice,
}) => {
  const outOfStockCount = competitors.filter((c) => !c.in_stock).length;
  const avgCompetitorPrice =
    competitors.length > 0
      ? competitors.reduce((acc, c) => acc + c.price, 0) / competitors.length
      : 0;

  return (
    <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-6 sm:p-8">
      
      {/* Module Header with Live Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#D4D4D8]">
        <div className="flex items-center gap-2.5">
          <Radar className="w-4 h-4 text-[#0066FF]" />
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-bold text-[#18181B]">
            MODULE 02 // SERPAPI GOOGLE SHOPPING COMPETITOR RADAR
          </h2>
        </div>

        {/* Telemetry Summary Badges */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[#F4F4F2] border border-[#D4D4D8] font-mono text-[10px] text-zinc-600">
            SCANNED: <strong className="text-[#18181B]">{competitors.length} NODES</strong>
          </div>
          <div className="px-2.5 py-1 bg-[#EF4444]/10 border border-[#EF4444]/30 font-mono text-[10px] text-[#EF4444] font-bold">
            STOCKOUT VACUUM: {outOfStockCount} OUT OF STOCK
          </div>
          <div className="hidden sm:block px-2.5 py-1 bg-[#F4F4F2] border border-[#D4D4D8] font-mono text-[10px] text-zinc-600">
            MARKET AVG: <strong className="text-[#18181B]">${avgCompetitorPrice.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Industrial Radar Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D4D4D8] bg-[#F4F4F2] font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              <th className="py-3 px-4">SOURCE / MERCHANT</th>
              <th className="py-3 px-4">LISTING HEADLINE</th>
              <th className="py-3 px-4 text-right">LISTED PRICE</th>
              <th className="py-3 px-4 text-center">STOCK STATUS</th>
              <th className="py-3 px-4 text-right">ARBITRAGE SPREAD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4D4D8] font-mono text-xs">
            {competitors.map((item, idx) => {
              const spread = suggestedPrice - item.price;
              const isSpreadPositive = spread >= 0;

              return (
                <tr
                  key={idx}
                  className="group hover:bg-[#F4F4F2] transition-colors duration-150 relative"
                >
                  {/* Merchant Source */}
                  <td className="py-4 px-4 font-bold text-[#18181B] flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#0066FF] transition-colors" />
                    <span>{item.source}</span>
                    {item.rating && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-zinc-400 ml-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    )}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-4 text-zinc-700 max-w-md truncate group-hover:italic group-hover:text-[#18181B] transition-all">
                    {item.title}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-right font-bold text-[#18181B]">
                    ${item.price.toFixed(2)}
                  </td>

                  {/* Stock Status Pill */}
                  <td className="py-4 px-4 text-center">
                    {item.in_stock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-bold tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        IN STOCK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-[10px] font-bold tracking-wider animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        DEPLETED / OOS
                      </span>
                    )}
                  </td>

                  {/* Arbitrage Spread */}
                  <td className="py-4 px-4 text-right font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 ${
                        isSpreadPositive
                          ? "bg-[#22C55E]/10 text-[#22C55E]"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {isSpreadPositive ? `+$${spread.toFixed(2)}` : `-$${Math.abs(spread).toFixed(2)}`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Callout Notice */}
      <div className="mt-4 pt-4 border-t border-[#D4D4D8] flex items-center justify-between font-mono text-[10px] text-zinc-500">
        <span>* Competitor prices and stock indicators updated real-time via SerpApi Google Shopping index.</span>
        <span className="text-[#0066FF] flex items-center gap-1">
          LIVE FEED <ExternalLink className="w-3 h-3" />
        </span>
      </div>

    </div>
  );
};
