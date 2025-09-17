"use client";
import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download, Filter, TrendingUp } from "lucide-react";

/**
 * Soule Smart Dashboard
 * - KPI Cards (MRR, ARR, Conversion, Churn)
 * - Revenue Trend (Area)
 * - Channel Performance (Bar)
 * - Customer Segments (Pie)
 * - Recent Events List
 *
 * Usage in Next.js App Router:
 *   app/dashboard/page.tsx -> dynamic import with { ssr: false }
 * Deps: npm i recharts lucide-react
 */

// ---------- Types ----------

type KPI = {
  id: string;
  label: string;
  value: string | number;
  delta?: number; // percentage change vs last period
};

type RevenuePoint = { date: string; mrr: number; newMRR: number; churnMRR: number };

type ChannelPoint = { channel: string; leads: number; signups: number; revenue: number };

type SegmentPoint = { name: string; value: number };

type EventRow = {
  id: string;
  date: string; // ISO
  event: string;
  kpi: string;
  impact: "positive" | "negative" | "neutral";
};

// ---------- Mock Data (replace with your API) ----------

const revenueSeries: RevenuePoint[] = [
  { date: "2025-01", mrr: 12400, newMRR: 4100, churnMRR: -900 },
  { date: "2025-02", mrr: 13950, newMRR: 4550, churnMRR: -1000 },
  { date: "2025-03", mrr: 15110, newMRR: 4680, churnMRR: -820 },
  { date: "2025-04", mrr: 16200, newMRR: 4970, churnMRR: -980 },
  { date: "2025-05", mrr: 17580, newMRR: 5220, churnMRR: -840 },
  { date: "2025-06", mrr: 18910, newMRR: 5510, churnMRR: -820 },
  { date: "2025-07", mrr: 20150, newMRR: 5740, churnMRR: -940 },
  { date: "2025-08", mrr: 21590, newMRR: 6030, churnMRR: -790 },
  { date: "2025-09", mrr: 22940, newMRR: 6420, churnMRR: -870 },
];

const channelData: ChannelPoint[] = [
  { channel: "SEO", leads: 840, signups: 210, revenue: 48000 },
  { channel: "Ads", leads: 610, signups: 130, revenue: 35500 },
  { channel: "Affiliate", leads: 320, signups: 95, revenue: 22700 },
  { channel: "Social", leads: 540, signups: 120, revenue: 23900 },
  { channel: "Events", leads: 180, signups: 60, revenue: 15400 },
];

const segmentData: SegmentPoint[] = [
  { name: "SMB", value: 45 },
  { name: "Mid-Market", value: 35 },
  { name: "Enterprise", value: 20 },
];

const recentEvents: EventRow[] = [
  { id: "e1", date: "2025-09-05", event: "Pricing A/B Test rolled out", kpi: "+3.4% MRR", impact: "positive" },
  { id: "e2", date: "2025-09-03", event: "Churn rescue campaign", kpi: "-0.6% Churn", impact: "positive" },
  { id: "e3", date: "2025-08-28", event: "Outage (45m)", kpi: "+0.3% Refunds", impact: "negative" },
  { id: "e4", date: "2025-08-21", event: "Partner integration", kpi: "+120 Signups", impact: "positive" },
];

// ---------- Helpers ----------

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

// ---------- Component ----------

export default function SouleSmartDashboard() {
  const [range, setRange] = useState<"3m" | "6m" | "12m">("6m");
  const [segmentFilter, setSegmentFilter] = useState<string>("All");

  const kpis: KPI[] = useMemo(() => {
    const last = revenueSeries[revenueSeries.length - 1];
    const prev = revenueSeries[revenueSeries.length - 2];
    const mrrDelta = ((last.mrr - prev.mrr) / prev.mrr) * 100;
    const arr = last.mrr * 12;
    const conversion = (channelData.reduce((a, c) => a + c.signups, 0) / channelData.reduce((a, c) => a + c.leads, 0)) * 100;
    const churn = Math.abs(last.churnMRR) / (last.mrr + Math.abs(last.churnMRR)) * 100;
    return [
      { id: "mrr", label: "MRR", value: formatCurrency(last.mrr), delta: mrrDelta },
      { id: "arr", label: "ARR", value: formatCurrency(arr), delta: mrrDelta },
      { id: "conv", label: "Conversion Rate", value: `${conversion.toFixed(1)}%` },
      { id: "churn", label: "Churn", value: `${churn.toFixed(2)}%` },
    ];
  }, []);

  const slicedRevenue = useMemo(() => {
    const len = revenueSeries.length;
    const map: Record<typeof range, number> = { "3m": 3, "6m": 6, "12m": 12 };
    return revenueSeries.slice(Math.max(0, len - map[range]));
  }, [range]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center">SS</div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Soule Smart Dashboard</h1>
              <p className="text-xs text-slate-800">KPI-Visualisierung & Reporting</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100">
              <Calendar className="h-4 w-4" />
              <span>Zeitraum</span>
            </button>
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {(["3m", "6m", "12m"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg",
                    range === r ? "bg-white shadow" : "text-slate-800"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-800">Segment:</span>
          {(["All", "SMB", "Mid-Market", "Enterprise"] as const).map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={cn(
                "inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs",
                segmentFilter === seg ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              )}
            >
              <Filter className="h-3.5 w-3.5" /> {seg}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-800">{kpi.label}</span>
                <TrendingUp className="h-4 w-4 text-slate-700" />
              </div>
              <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
              {typeof kpi.delta === "number" && (
                <div className={cn("mt-1 text-xs", (kpi.delta ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {formatPct(kpi.delta!)} vs Vormonat
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Revenue Trend</h2>
              <span className="text-xs text-slate-800">MRR, New MRR, Churn</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={slicedRevenue} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopOpacity={0.3} />
                      <stop offset="95%" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  <Legend />
                  <Area type="monotone" dataKey="mrr" name="MRR" strokeWidth={2} fillOpacity={0.2} fill="url(#mrr)" />
                  <Area type="monotone" dataKey="newMRR" name="New MRR" strokeWidth={2} fillOpacity={0.1} />
                  <Area type="monotone" dataKey="churnMRR" name="Churn MRR" strokeWidth={2} fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Customer Segments</h2>
              <span className="text-xs text-slate-800">Anteile nach Umsatz</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={segmentData} dataKey="value" nameKey="name" outerRadius={80} label />
                  {segmentData.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Bar + Table */}
        <section className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Channel Performance</h2>
              <span className="text-xs text-slate-800">Leads • Signups • Revenue</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${Math.round(v / 1000)}k€`} />
                  <Tooltip formatter={(v: any, n: any) => (n === "revenue" ? formatCurrency(Number(v)) : v)} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="leads" name="Leads" />
                  <Bar yAxisId="left" dataKey="signups" name="Signups" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Letzte Ereignisse</h2>
              <span className="text-xs text-slate-800">KPI-Impact</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {recentEvents.map((e) => (
                <li key={e.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{e.event}</p>
                      <p className="text-xs text-slate-800">{new Date(e.date).toLocaleDateString("de-DE")}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs rounded-full px-2 py-1",
                        e.impact === "positive" && "bg-emerald-50 text-emerald-700",
                        e.impact === "negative" && "bg-rose-50 text-rose-700",
                        e.impact === "neutral" && "bg-slate-100 text-slate-700"
                      )}
                    >
                      {e.kpi}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 text-center text-xs text-slate-800">
        © {new Date().getFullYear()} Soulé Smart Business • Built with Next.js, TypeScript & Tailwind
      </footer>
    </div>
  );
}
