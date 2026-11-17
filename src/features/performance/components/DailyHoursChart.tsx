"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMinutes } from "@/lib/format";
import { useTheme } from "@/lib/theme";

type Point = { label: string; minutes: number };

const COLORS = {
  light: { bar: "#4f46e5", grid: "#e2e4ec", tick: "#6b7280", tooltipBg: "#ffffff", tooltipText: "#1f2430", cursor: "rgba(79,70,229,0.08)" },
  dark: { bar: "#818cf8", grid: "#2a2f3d", tick: "#9aa3b5", tooltipBg: "#181b24", tooltipText: "#e5e7ee", cursor: "rgba(129,140,248,0.12)" },
};

export function DailyHoursChart({ data }: { data: Point[] }) {
  const c = COLORS[useTheme()];

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.grid} />
          <XAxis dataKey="label" fontSize={12} minTickGap={16} tick={{ fill: c.tick }} stroke={c.grid} />
          <YAxis
            fontSize={12}
            tick={{ fill: c.tick }}
            stroke={c.grid}
            tickFormatter={(v: number) => `${Math.round(v / 60)}h`}
          />
          <Tooltip
            formatter={(value: number) => [formatMinutes(value), "Estudado"]}
            cursor={{ fill: c.cursor }}
            contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.grid}`, borderRadius: 8, color: c.tooltipText }}
            labelStyle={{ color: c.tooltipText }}
            itemStyle={{ color: c.tooltipText }}
          />
          <Bar dataKey="minutes" fill={c.bar} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
