import { Users, CreditCard, CalendarDays, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/custom/dashboard/stats-cards";
import { statusStyle } from "./dashboard";
import type { ClientsStats } from "@/lib/data/clients";

export { statusStyle };

export const STATUTS = ["Tous", "En cours", "Partiel", "En retard", "Payé"] as const;

export function buildClientsStats(s: ClientsStats): StatCard[] {
  const diff = s.nouveauxCeMois - s.nouveauxMoisDernier;

  return [
    {
      label: "Total clients",
      value: String(s.totalClients),
      icon: Users,
      sub: "enregistrés",
    },
    {
      label: "Clients avec crédits",
      value: String(s.clientsAvecCredits),
      icon: CreditCard,
    },
    {
      label: "Nouveaux ce mois",
      value: String(s.nouveauxCeMois),
      icon: CalendarDays,
      trend: `${diff >= 0 ? "+" : ""}${diff} vs mois dernier`,
      trendUp: diff >= 0,
    },
    {
      label: "Total crédits",
      value: s.totalEncours.toLocaleString("fr-FR"),
      unit: "MRU",
      icon: TrendingUp,
      sub: "encours global",
    },
  ];
}