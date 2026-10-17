"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const MARQUEE_ITEMS = [
  { type: "stroke", text: "COMPETITOR DEPLETION" },
  { type: "serif", text: "+18% Surge Window" },
  { type: "stroke", text: "TABPFN-3.5 INFERENCE" },
  { type: "serif", text: "Zero-Shot Tabular Prior" },
  { type: "stroke", text: "SERPAPI REAL-TIME NODES" },
  { type: "serif", text: "Buy Box Arbitrage" },
  { type: "stroke", text: "GEMMA DYNAMIC PRICING" },
  { type: "serif", text: "60s Spoken Audio Memo" },
];

export const TickerMarquee: React.FC = () => {
  return (
    <div className="w-full h-24 bg-[#F4F4F2] border-y border-[#D4D4D8] overflow-hidden flex items-center relative select-none">
      {/* Subtle edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#EBEBE8] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#EBEBE8] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee items-center whitespace-nowrap">
        {/* Render twice for continuous loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 md:gap-8 mx-4 md:mx-6">
            {item.type === "stroke" ? (
              <span className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-stroke uppercase">
                {item.text}
              </span>
            ) : (
              <span className="text-2xl md:text-4xl font-serif italic text-[#18181B] font-normal">
                {item.text}
              </span>
            )}
            
            {/* Electric Cobalt 8-pointed Star / Sparkle separator */}
            <div className="flex items-center justify-center text-[#0066FF]">
              <Sparkles className="w-5 h-5 fill-[#0066FF] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
