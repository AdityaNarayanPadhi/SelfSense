"use client";

import React from "react";
import { Download, ArrowUpRight, Cpu } from "lucide-react";

interface HeaderProps {
  onScanClick: () => void;
  isAnalyzing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onScanClick, isAnalyzing }) => {
  return (
    <header className="sticky top-0 z-40 h-20 w-full bg-[#EBEBE8]/90 backdrop-blur-md border-b border-[#D4D4D8]">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
        
        {/* Left: Telemetry, Coordinates & Engine Status */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-[#F4F4F2] border border-[#D4D4D8]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#18181B]">
              SHELF-SENSE v3.5
            </span>
          </div>

          <div className="hidden sm:flex flex-col font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500 leading-tight">
            <span>N 37° 46&apos; 29&quot;</span>
            <span>W 122° 25&apos; 10&quot;</span>
          </div>
        </div>

        {/* Center: Monolithic Editorial Branding */}
        <div className="flex items-baseline tracking-tight select-none cursor-pointer">
          <span className="font-serif italic text-2xl md:text-3xl font-normal text-[#18181B] mr-1">
            Shelf
          </span>
          <span className="font-sans font-black text-2xl md:text-3xl tracking-tighter text-[#18181B]">
            SENSE
          </span>
          <span className="text-[#0066FF] text-xl font-bold ml-1">.</span>
        </div>

        {/* Right: Quick Sample CSV & Scan Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="/sample_inventory.csv"
            download="sample_inventory.csv"
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#F4F4F2] hover:bg-[#FFFFFF] text-[#18181B] border border-[#D4D4D8] font-mono text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200"
            title="Download synthetic 5-row inventory velocity CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SAMPLE.CSV</span>
          </a>

          <button
            onClick={onScanClick}
            disabled={isAnalyzing}
            className="group relative inline-flex items-center gap-2.5 px-4 md:px-5 py-2.5 bg-[#18181B] hover:bg-[#0066FF] text-[#EBEBE8] border border-[#18181B] font-mono text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5 text-[#22C55E] group-hover:text-white transition-colors" />
            <span>{isAnalyzing ? "SCANNING..." : "RUN ARBITRAGE SCAN"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};
