"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, ArrowRight, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

interface HeroEngineProps {
  onAnalyze: (query: string, file: File | null) => Promise<void>;
  isAnalyzing: boolean;
  analysisStep: number;
}

const ANALYSIS_STEPS = [
  "1. Querying SerpApi Google Shopping nodes...",
  "2. Fitting TabPFN tabular depletion prior...",
  "3. Synthesizing Gemma algorithmic pricing memo...",
  "4. Rendering ElevenLabs 60s morning audio stream...",
];

export const HeroEngine: React.FC<HeroEngineProps> = ({
  onAnalyze,
  isAnalyzing,
  analysisStep,
}) => {
  const [productQuery, setProductQuery] = useState(
    "Sony WH-1000XM5 Wireless Noise Canceling Headphones"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(productQuery, selectedFile);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (7 cols): Editorial Typography & Directive */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Micro Directive Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 bg-[#18181B] text-[#EBEBE8]">
              [ ARBITRAGE DIRECTIVE 2026 ]
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 hidden sm:inline">
              AUTONOMOUS INVENTORY RADAR
            </span>
          </div>

          {/* Large Fluid Display Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter mb-8 select-none">
            <span className="block text-stroke font-black">
              OUT-OF-STOCK
            </span>
            <span className="block font-serif italic font-normal text-[#18181B] my-1">
              Surge Engine
            </span>
            <span className="block font-sans font-black text-[#18181B] tracking-tight">
              FOR HIGH-VELOCITY D2C.
            </span>
          </h1>

          {/* Subtitle / System Overview */}
          <p className="font-sans text-base md:text-lg text-zinc-700 leading-relaxed max-w-2xl mb-8">
            When competitor nodes go out of stock, ShelfSense detects the vacuum in real time. 
            Combining <strong className="text-[#18181B] font-semibold">TabPFN-3.5</strong> foundation models for tabular regression, 
            <strong className="text-[#18181B] font-semibold"> SerpApi</strong> Google Shopping crawlers, 
            <strong className="text-[#18181B] font-semibold"> Google Gemma</strong> dynamic pricing directors, and 
            <strong className="text-[#18181B] font-semibold"> ElevenLabs</strong> audio briefs, capture instant Buy Box arbitrage margin.
          </p>

          {/* Technical Telemetry Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#D4D4D8]">
            <div className="p-3 bg-[#F4F4F2] border border-[#D4D4D8]">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em]">TABULAR PRIOR</span>
              <span className="font-mono text-xs font-bold text-[#18181B]">TabPFN-3.5</span>
            </div>
            <div className="p-3 bg-[#F4F4F2] border border-[#D4D4D8]">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em]">SHOPPING RADAR</span>
              <span className="font-mono text-xs font-bold text-[#18181B]">SerpApi Nodes</span>
            </div>
            <div className="p-3 bg-[#F4F4F2] border border-[#D4D4D8]">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em]">REASONING LLM</span>
              <span className="font-mono text-xs font-bold text-[#18181B]">Gemma 2 Quants</span>
            </div>
            <div className="p-3 bg-[#F4F4F2] border border-[#D4D4D8]">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em]">SPOKEN MEMO</span>
              <span className="font-mono text-xs font-bold text-[#18181B]">ElevenLabs v2</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Technical Ingestion Console */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFFFFF] border border-[#D4D4D8] p-6 sm:p-8 shadow-2xl relative">
            
            {/* Console Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D4D4D8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#0066FF]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-[#18181B]">
                  SCAN INTAKE CONSOLE
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">
                SYS_READY
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field 1: Target Product Query */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#18181B] mb-2">
                  01 // PRODUCT QUERY OR ASIN
                </label>
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  disabled={isAnalyzing}
                  required
                  className="w-full px-4 py-3 bg-[#F4F4F2] border border-[#D4D4D8] text-[#18181B] font-mono text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#0066FF] transition-colors"
                />
                
                {/* Query Quick Picks */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider self-center">Quick:</span>
                  {[
                    "Sony WH-1000XM5",
                    "Dyson Airwrap Styler",
                    "Fujifilm X100VI",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setProductQuery(preset)}
                      className="font-mono text-[9px] px-2 py-0.5 bg-[#F4F4F2] hover:bg-zinc-200 text-zinc-700 border border-[#D4D4D8] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Inventory CSV Upload Zone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#18181B]">
                    02 // HISTORICAL DEPLETION CSV
                  </label>
                  <a
                    href="/sample_inventory.csv"
                    download="sample_inventory.csv"
                    className="font-mono text-[9px] text-[#0066FF] hover:underline uppercase tracking-wider"
                  >
                    Load Sample CSV
                  </a>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#0066FF] bg-[#0066FF]/5"
                      : selectedFile
                      ? "border-[#22C55E] bg-[#22C55E]/5"
                      : "border-[#D4D4D8] bg-[#F4F4F2] hover:bg-zinc-100"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-[#22C55E] mb-2" />
                      <span className="font-mono text-xs font-bold text-[#18181B] truncate max-w-xs">
                        {selectedFile.name}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Ready for TabPFN
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="font-mono text-xs font-semibold text-[#18181B]">
                        DRAG & DROP CSV OR CLICK TO BROWSE
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 mt-1">
                        Requires units_sold_7d, price_delta, stock_remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button & Loading Readout */}
              <div>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full relative group py-4 px-6 bg-[#18181B] hover:bg-[#0066FF] text-[#EBEBE8] font-mono text-xs uppercase tracking-[0.25em] font-bold border border-[#18181B] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#22C55E]" />
                      <span>PROCESSING PIPELINE...</span>
                    </>
                  ) : (
                    <>
                      <span>EXECUTE ARBITRAGE SCAN</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Multi-Step Technical Readout during Loading */}
                {isAnalyzing && (
                  <div className="mt-4 p-3 bg-[#18181B] border border-zinc-700 text-[#EBEBE8] font-mono text-[10px] space-y-1.5">
                    {ANALYSIS_STEPS.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 ${
                          idx === analysisStep
                            ? "text-[#0066FF] font-bold"
                            : idx < analysisStep
                            ? "text-[#22C55E]"
                            : "text-zinc-500"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
