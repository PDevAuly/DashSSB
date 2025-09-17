import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soule Smart Dashboard",
  description: "KPI-Visualisierung & Reporting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
