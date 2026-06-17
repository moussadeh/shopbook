export type StatutCredit = "Non payé" | "En cours" | "Payé";

export function statusStyle(statut: string) {
  switch (statut) {
    case "Payé":     return "bg-green-100 text-green-700";
    case "En cours": return "bg-amber-100 text-amber-700";
    case "Non payé": return "bg-red-100 text-red-700";
    default:         return "bg-gray-100 text-gray-600";
  }
}

export const STATUTS = ["Tous", "Non payé", "En cours", "Payé"] as const;

import { CreditCard, Download, Users, Package } from "lucide-react";
import { StatCard } from "@/components/custom/dashboard/stats-cards";
 
export const dashboardStats: StatCard[] = [
  { label: "Crédits actifs",  value: "125 500", unit: "MRU", icon: CreditCard, trend: "+12.5% ce mois", trendUp: true  },
  { label: "Paiements reçus", value: "75 300",  unit: "MRU", icon: Download,   trend: "+8.2% ce mois",  trendUp: true  },
  { label: "Clients",         value: "248",      unit: "",    icon: Users,       trend: "+18.7%",         trendUp: true  },
  { label: "Produits",        value: "320",      unit: "",    icon: Package,     sub: "en catalogue",                    },
];