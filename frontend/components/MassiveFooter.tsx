"use client";

import React from "react";
import { Github, ExternalLink, Cpu, Terminal, ArrowUp } from "lucide-react";

export const MassiveFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#18181B] text-[#EBEBE8] border-t border-zinc-800 pt-16 pb-12 overflow-hidden select-none">
      
      {/* Background Watermark Marquee */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center overflow-hidden whitespace-nowrap">
        <span className="text-[14vw] font-black tracking-tighter uppercase font-sans animate-marquee">
          SHELFSENSE AUTOMATED SYSTEMS // HIGH-VELOCITY ARBITRAGE // TABPFN INFERENCE // SERPAPI RADAR //
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">
          
          {/* Left Column (6 cols): Brand, Coordinates & System Ping */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-baseline tracking-tight">
              <span className="font-serif italic text-3xl font-normal text-white mr-1">
                Shelf
              </span>
              <span className="font-sans font-black text-3xl tracking-tighter text-white">
                SENSE
              </span>
              <span className="text-[#0066FF] text-2xl font-bold ml-1">.</span>
            </div>

            <p className="font-mono text-xs text-zinc-400 max-w-md leading-relaxed">
              Algorithmic inventory arbitrage, stockout detection, and dynamic pricing intelligence 
              engine for top-tier Shopify and Amazon sellers.
            </p>

            {/* System Status Ping & Coordinates */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#22C55E] font-bold">
                  ALL SHOPPING & INFERENCE NODES OPERATIONAL
                </span>
              </div>

              <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                COORDINATES: N 37° 46&apos; 29&quot; / W 122° 25&apos; 10&quot; // BUILD 2026.10
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Direct Links & Repos */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono text-xs">
            
            {/* Nav Group 1 */}
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-4">
                CORE STACK
              </span>
              <ul className="space-y-2.5 text-zinc-400">
                <li className="hover:text-white transition-colors cursor-pointer">TabPFN-3.5 Prior</li>
                <li className="hover:text-white transition-colors cursor-pointer">SerpApi Shopping</li>
                <li className="hover:text-white transition-colors cursor-pointer">Google Gemma 2</li>
                <li className="hover:text-white transition-colors cursor-pointer">ElevenLabs Voice</li>
              </ul>
            </div>

            {/* Nav Group 2 */}
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-4">
                RESOURCES
              </span>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://github.com/AdityaNarayanPadhi/SelfSense.git"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repo</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://shelfsense-api.onrender.com/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>OpenAPI Docs</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/sample_inventory.csv"
                    download="sample_inventory.csv"
                    className="text-zinc-400 hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Sample CSV</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Back to Top */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-4">
                  NAVIGATION
                </span>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10px] uppercase tracking-wider transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>TOP</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Microstrip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500">
          <div>
            © 2026 SHELFSENSE SYSTEMS // ALL RIGHTS RESERVED // WARM INDUSTRIAL BRUTALISM
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">PRIVACY PROTOCOL</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">TERMS OF DIRECTIVE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
