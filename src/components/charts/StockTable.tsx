"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber, formatPercent, getMarketColor } from "@/lib/utils";
import type { Stock } from "@/types";

interface StockTableProps {
  stocks: Stock[];
  title?: string;
  showVolume?: boolean;
  showMarketCap?: boolean;
  limit?: number;
}

export function StockTable({ 
  stocks, 
  title, 
  showVolume = true, 
  showMarketCap = false,
  limit 
}: StockTableProps) {
  const displayStocks = limit ? stocks.slice(0, limit) : stocks;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-lanka-text-primary">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-lanka-text-muted uppercase">
              <th className="text-left px-4 py-2 font-medium">Symbol</th>
              <th className="text-left px-4 py-2 font-medium">Company</th>
              <th className="text-right px-4 py-2 font-medium">Price</th>
              <th className="text-right px-4 py-2 font-medium">Change</th>
              <th className="text-right px-4 py-2 font-medium">% Change</th>
              {showVolume && <th className="text-right px-4 py-2 font-medium">Volume</th>}
              {showMarketCap && <th className="text-right px-4 py-2 font-medium">Mkt Cap</th>}
            </tr>
          </thead>
          <tbody>
            {displayStocks.map((stock) => (
              <tr 
                key={stock.symbol} 
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono font-semibold text-lanka-accent text-xs">
                  {stock.symbol}
                </td>
                <td className="px-4 py-2.5 text-lanka-text-primary">
                  <div className="font-medium">{stock.name}</div>
                  <div className="text-xs text-lanka-text-muted">{stock.sector}</div>
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-medium text-lanka-text-primary">
                  {formatNumber(stock.price, 2)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`flex items-center justify-end gap-1 ${getMarketColor(stock.change)}`}>
                    {stock.change > 0 ? <TrendingUp className="w-3 h-3" /> : stock.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {stock.change > 0 ? "+" : ""}{formatNumber(stock.change, 2)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    stock.changePercent > 0 
                      ? "bg-lanka-green/10 text-lanka-green" 
                      : stock.changePercent < 0 
                        ? "bg-lanka-red/10 text-lanka-red" 
                        : "bg-gray-500/10 text-lanka-text-muted"
                  }`}>
                    {formatPercent(stock.changePercent)}
                  </span>
                </td>
                {showVolume && (
                  <td className="px-4 py-2.5 text-right font-mono text-lanka-text-secondary text-xs">
                    {formatNumber(stock.volume)}
                  </td>
                )}
                {showMarketCap && (
                  <td className="px-4 py-2.5 text-right font-mono text-lanka-text-secondary text-xs">
                    {stock.marketCap ? formatNumber(stock.marketCap) : "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
