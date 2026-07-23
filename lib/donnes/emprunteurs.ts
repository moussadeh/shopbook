import { Users, CreditCard, CalendarDays, TrendingUp } from "lucide-react";
import type { StatCard } from "@/components/custom/dashboard/stats-cards";
import type { EmprunteursStats } from "@/lib/data/emprunteurs";

export const STATUTS = ["Tous", "Non payé", "En cours", "Payé"] as const;

export function statusStyle(statut: string) {
  switch (statut) {
    case "Payé":     return "bg-green-100 text-green-700";
    case "En cours": return "bg-amber-100 text-amber-700";
    case "Non payé": return "bg-red-100 text-red-700";
    default:         return "bg-gray-100 text-gray-600";
  }
}

export function buildEmprunteursStats(s: EmprunteursStats): StatCard[] {
  return [
    { label: "Total clients",       value: String(s.total),           icon: Users,        sub: "enregistrés" },
    { label: "Avec crédits",        value: String(s.avecCredits),     icon: CreditCard,   sub: "ont au moins un crédit" },
    { label: "Nouveaux ce mois",    value: String(s.nouveauxCeMois),  icon: CalendarDays, sub: "ajoutés ce mois" },
    { label: "À récupérer",         value: s.totalEncours.toLocaleString("fr-FR"), unit: "MRU", icon: TrendingUp, sub: "dû par vos clients" },
  ];
}