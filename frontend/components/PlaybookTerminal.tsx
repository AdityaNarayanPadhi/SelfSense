"use client";

import React, { useState } from "react";
import { ArbitrageStrategy } from "../lib/types";
import { Terminal, Copy, Check, TrendingUp, Megaphone, ListOrdered, Sparkles } from "lucide-react";

interface PlaybookTerminalProps {
  strategy: ArbitrageStrategy;
}

export const PlaybookTerminal: React.FC<PlaybookTerminalProps> = ({ strategy }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const isSurge = strategy.suggested_price_delta_percent >= 0;

  return (
    <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-6 sm:p-8">
      
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#D4D4D8]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#0066FF]" />
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-bold text-[#18181B]">
            MODULE 03 // GEMMA ALGORITHMIC PLAYBOOK & AD COPY
          </h2>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          QUANT DIRECTIVE: DYNAMIC PRICING & PPC EXPANSION
        </span>
      </div>

      {/* Dynamic Pricing Recommendation Banner */}
      <div className="bg-[#18181B] text-[#EBEBE8] p-6 mb-8 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#22C55E] font-bold">
              OPTIMAL PRICING ARBITRAGE ARTIFACT
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-sans font-black tracking-tight">
            {isSurge ? "SURGE LIST PRICE BY " : "DEFENSIVE DISCOUNT "}
            <span className={isSurge ? "text-[#22C55E]" : "text-[#F59E0B]"}>
              {strategy.suggested_price_delta_percent > 0 ? "+" : ""}
              {strategy.suggested_price_delta_percent.toFixed(1)}%
            </span>
            {" → "}
            <span className="text-white underline decoration-[#0066FF] decoration-2">
              ${strategy.new_suggested_price.toFixed(2)}
            </span>
          </div>
          <p className="font-mono text-xs text-zinc-400 mt-1">
            Calibrated against competitor stockout voids and TabPFN internal velocity burn.
          </p>
        </div>

        <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 font-mono text-xs text-zinc-300">
          DELTA: <strong className="text-white">${(strategy.new_suggested_price * (Math.abs(strategy.suggested_price_delta_percent) / 100)).toFixed(2)} / unit</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (6 cols): 30-Char Constrained Google/Meta Ad Copy */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0066FF]" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#18181B]">
                  PUNCHY SEARCH AD HEADLINES (&lt;30 CHARS)
                </h3>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                1-CLICK COPY
              </span>
            </div>

            <div className="space-y-3">
              {strategy.ad_headlines.map((headline, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-[#F4F4F2] hover:bg-[#FFFFFF] border border-[#D4D4D8] transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="font-mono text-xs font-bold text-[#18181B]">
                        &quot;{headline}&quot;
                      </div>
                      <div className="font-mono text-[9px] text-zinc-500 mt-0.5">
                        {headline.length} / 30 Characters
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(headline, idx)}
                    className="p-2 bg-[#FFFFFF] group-hover:bg-[#18181B] group-hover:text-white border border-[#D4D4D8] transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#F4F4F2] border border-[#D4D4D8] font-mono text-[10px] text-zinc-500">
            * Direct drop-in copy for Google Shopping Text Assets, Meta Ads headlines, and Amazon Sponsored Brands.
          </div>
        </div>

        {/* Right Column (6 cols): Merchant Tactical Execution Directives */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 mb-4">
            <ListOrdered className="w-4 h-4 text-[#0066FF]" />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#18181B]">
              TACTICAL EXECUTION DIRECTIVES
            </h3>
          </div>

          <div className="space-y-3">
            {strategy.action_steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FFFFFF] border border-[#D4D4D8] flex items-start gap-3"
              >
                <span className="w-5 h-5 flex-shrink-0 bg-[#18181B] text-[#EBEBE8] font-mono text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="font-mono text-xs text-zinc-800 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Gemma Model Telemetry Footnote */}
          <div className="mt-4 p-3 bg-[#18181B] text-zinc-400 font-mono text-[10px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Sparkles className="w-3 h-3 text-[#0066FF]" />
              ENGINE: GEMMA-2 9B QUANTIZED
            </span>
            <span>FORMAT: STRUCTURED JSON</span>
          </div>
        </div>

      </div>

    </div>
  );
};
