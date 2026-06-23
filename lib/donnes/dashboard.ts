import { StatCard } from "@/components/custom/dashboard/stats-cards";
import { Users, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { DashboardStats } from "@/lib/data/dashboard";
import { StatutCredit } from "@/app/generated/prisma/enums";

export function statusStyle(statut: string) {
  switch (statut) {
    case "Payé":     return "bg-green-100 text-green-700";
    case "En cours": return "bg-amber-100 text-amber-700";
    case "Non payé": return "bg-red-100 text-red-700";
    default:         return "bg-gray-100 text-gray-600";
  }
}

export const donutColor: Record<StatutCredit, string> = {
  NON_PAYE: "#ef4444",
  EN_COURS: "#f59e0b",
  PAYE:     "#166534",
};

export function buildDashboardStats(s: DashboardStats): StatCard[] {
  return [
    { label: "Clients",          value: String(s.totalClients),                   icon: Users,        sub: "enregistrés" },
    { label: "À récupérer",    value: s.encoursTotal.toLocaleString("fr-FR"),    unit: "MRU", icon: TrendingDown, sub: "à recouvrer" },
    { label: "Encaissé ce mois", value: s.encaisseCeMois.toLocaleString("fr-FR"),  unit: "MRU", icon: TrendingUp,   sub: "paiements reçus" },
    { label: "Crédits en cours",   value: String(s.creditsActifs),                   icon: Wallet,       sub: "non soldés" },
  ];
}