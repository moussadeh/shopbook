import { Wallet, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";
import type { StatCard } from "@/components/custom/dashboard/stats-cards";
import type { CreditsStats } from "@/lib/data/credits";
import { StatutCredit } from "@/app/generated/prisma/client";

export function formatMRU(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} MRU`;
}

export const statutCreditLabel: Record<StatutCredit, string> = {
  NON_PAYE: "Non payé",
  EN_COURS: "En cours",
  PAYE:     "Payé",
};

export const STATUTS_CREDIT: string[] = ["Tous", ...Object.values(statutCreditLabel)];

export function statusStyle(statut: string) {
  switch (statut) {
    case "Payé":     return "bg-green-100 text-green-700";
    case "En cours": return "bg-amber-100 text-amber-700";
    case "Non payé": return "bg-red-100 text-red-700";
    default:         return "bg-gray-100 text-gray-600";
  }
}

export function buildCreditsStats(s: CreditsStats): StatCard[] {
  return [
    { label: "Crédits en cours",   value: String(s.creditsActifs),                  icon: Wallet,       sub: "non payés" },
    { label: "À récupérer",    value: s.encoursTotal.toLocaleString("fr-FR"),   unit: "MRU", icon: TrendingDown, sub: "dû par vos clients" },
    { label: "Encaissé ce mois", value: s.encaisseCeMois.toLocaleString("fr-FR"), unit: "MRU", icon: TrendingUp,   sub: "paiements reçus" },
    { label: "Crédits payés",   value: String(s.creditsSoldes),                  icon: CheckCircle2, sub: "payés" },
  ];
}