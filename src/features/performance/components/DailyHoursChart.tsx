"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMinutes } from "@/lib/format";

type Point = { label: string; minutes: number };

export function DailyHoursChart({ data }: { data: Point[] }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" fontSize={12} minTickGap={16} />
          <YAxis fontSize={12} tickFormatter={(v: number) => `${Math.round(v / 60)}h`} />
          <Tooltip
            formatter={(value: number) => [formatMinutes(value), "Estudado"]}
            cursor={{ fill: "rgba(79,70,229,0.08)" }}
          />
          <Bar dataKey="minutes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
