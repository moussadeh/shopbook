export type StatutCredit = "En cours" | "Partiel" | "En retard" | "Payé";

export function statusStyle(status: StatutCredit): string {
  switch (status) {
    case "En cours":           return "bg-green-100 text-green-700";
    case "Partiel":            return "bg-orange-100 text-orange-600";
    case "En retard":          return "bg-red-100 text-red-600";
    case "Payé":               return "bg-gray-100 text-gray-600";
  }
}

import { CreditCard, Download, Users, Package } from "lucide-react";
import { StatCard } from "@/components/custom/dashboard/stats-cards";
 
export const dashboardStats: StatCard[] = [
  { label: "Crédits actifs",  value: "125 500", unit: "MRU", icon: CreditCard, trend: "+12.5% ce mois", trendUp: true  },
  { label: "Paiements reçus", value: "75 300",  unit: "MRU", icon: Download,   trend: "+8.2% ce mois",  trendUp: true  },
  { label: "Clients",         value: "248",      unit: "",    icon: Users,       trend: "+18.7%",         trendUp: true  },
  { label: "Produits",        value: "320",      unit: "",    icon: Package,     sub: "en catalogue",                    },
];