"use client";
import dynamic from "next/dynamic";

// Nimm den relativen Pfad wie bei dir im Fehler-Log
const SouleSmartDashboard = dynamic(
  () => import("../../components/SouleSmartDashboard"),
  { ssr: false }
);

export default function ClientDashboard() {
  return <SouleSmartDashboard />;
}
