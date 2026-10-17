import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShelfSense — E-Commerce Inventory Arbitrage & Stockout Engine",
  description:
    "Real-time Google Shopping competitor crawl, TabPFN tabular depletion forecasting, Google Gemma arbitrage directives, and ElevenLabs morning audio briefs for Shopify & Amazon merchants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#EBEBE8] text-[#18181B] selection:bg-[#0066FF] selection:text-white relative">
        {/* Persistent Global Analog Grain Texture */}
        <div className="fixed inset-0 pointer-events-none z-[100] bg-grain" />

        {/* Fixed 12-Column Structural Architectural Grid */}
        <div className="fixed inset-0 pointer-events-none z-0 max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-full w-full grid grid-cols-12 border-x border-zinc-900/[0.07]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full border-r border-zinc-900/[0.07] last:border-r-0"
              />
            ))}
          </div>
        </div>

        {/* Application Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
