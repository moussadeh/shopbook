import { StatutCommande, StatutPaiementCommande, ModeCommande } from "@/app/generated/prisma/client";
import { Inbox, Loader, PackageCheck, Wallet } from "lucide-react";
import type { StatCard } from "@/components/custom/dashboard/stats-cards";
import type { CommandesStats } from "@/lib/data/commandes";

export const statutLabel: Record<StatutCommande, string> = {
  NOUVELLE: "Nouvelle",
  EN_PREPARATION: "En préparation",
  PRETE: "Prête au retrait",
  EN_LIVRAISON: "En livraison",
  RECUPEREE: "Récupérée",
  LIVREE: "Livrée",
  REFUSEE: "Refusée",
  ANNULEE: "Annulée",
};

export const statutStyle: Record<StatutCommande, string> = {
  NOUVELLE: "bg-blue-100 text-blue-700",
  EN_PREPARATION: "bg-amber-100 text-amber-700",
  PRETE: "bg-purple-100 text-purple-700",
  EN_LIVRAISON: "bg-purple-100 text-purple-700",
  RECUPEREE: "bg-green-100 text-green-700",
  LIVREE: "bg-green-100 text-green-700",
  REFUSEE: "bg-red-100 text-red-700",
  ANNULEE: "bg-gray-100 text-gray-500",
};

export const modeLabel: Record<ModeCommande, string> = {
  LIVRAISON: "Livraison",
  RETRAIT: "Retrait",
};

export function paiementLabel(s: StatutPaiementCommande) {
  return s === "PAYEE" ? "Payée" : "En attente";
}

export const formatMRU = (n: number) => `${n.toLocaleString("fr-FR")} MRU`;

export function buildCommandesStats(s: CommandesStats): StatCard[] {
  return [
    { label: "Nouvelles",    value: String(s.nouvelles),   icon: Inbox,        sub: "à traiter" },
    { label: "En cours",     value: String(s.enCours),     icon: Loader,       sub: "en préparation" },
    { label: "À encaisser",  value: String(s.aEncaisser),  icon: Wallet,       sub: "remises non payées" },
    { label: "Terminées",    value: String(s.terminees),   icon: PackageCheck, sub: "clôturées" },
  ];
}