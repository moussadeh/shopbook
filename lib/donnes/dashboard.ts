import type { StatCard } from "@/components/custom/dashboard/stats-cards";
import { Users, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { DashboardStats, DonutSegment } from "@/lib/data/dashboard";

export function statusStyle(statut: string) {
  switch (statut) {
    case "Payé":     return "bg-green-100 text-green-700";
    case "En cours": return "bg-amber-100 text-amber-700";
    case "Non payé": return "bg-red-100 text-red-700";
    default:         return "bg-gray-100 text-gray-600";
  }
}

export const donutColor: Record<DonutSegment["cle"], string> = {
  paye:    "#166534",  // vert foncé
  restant: "#f59e0b",  // ambre
};

export function buildDashboardStats(s: DashboardStats): StatCard[] {
  return [
    { label: "Clients",          value: String(s.totalEmprunteurs),               icon: Users,        sub: "enregistrés" },
    { label: "À récupérer",      value: s.encoursTotal.toLocaleString("fr-FR"),   unit: "MRU", icon: TrendingDown, sub: "dû par vos clients" },
    { label: "Encaissé ce mois", value: s.encaisseCeMois.toLocaleString("fr-FR"), unit: "MRU", icon: TrendingUp,   sub: "paiements reçus" },
    { label: "Crédits en cours", value: String(s.creditsActifs),                  icon: Wallet,       sub: "non soldés" },
  ];
}