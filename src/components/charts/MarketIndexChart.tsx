"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  time: string;
  value: number;
}

interface MarketIndexChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
}

export function MarketIndexChart({ data, color = "#00d4aa", height = 200 }: MarketIndexChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis 
          dataKey="time" 
          tick={{ fill: "#5a5a6a", fontSize: 10 }}
          axisLine={{ stroke: "#1e1e2e" }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: "#5a5a6a", fontSize: 10 }}
          axisLine={{ stroke: "#1e1e2e" }}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#12121a",
            border: "1px solid #1e1e2e",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#e2e2e8" }}
          itemStyle={{ color: color }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
