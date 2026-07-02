// import { Package, Wallet, AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";
// import type { StatCard } from "@/components/custom/dashboard/stats-cards";
// import type { ProduitsStats } from "@/lib/data/produits";
// import { UniteProduit } from "@/app/generated/prisma/client";
// import { CategorieProduit } from "@/app/generated/prisma/client";

// export const uniteLabel: Record<UniteProduit, string> = {
//   SAC:       "Sac",
//   KILO:      "Kilo",
//   LIBAR:     "Libar",
//   LITRE:     "Litre",
//   SACHET:    "Sachet",
//   CARTON:    "Carton",
//   BOITE:     "Boîte",
//   BOUTEILLE: "Bouteille",
//   BIDON:     "Bidon",
//   METRE:     "Mètre",
//   PAQUET:    "Paquet",
// };
 
// export const produitsStats: StatCard[] = [
//   { label: "Total produits",   value: "320",  icon: Package,      sub: "en catalogue"                           },
//   { label: "Stock bas",        value: "12",   icon: AlertTriangle,trend: "sous le seuil",    trendUp: false      },
//   { label: "Ventes ce mois",   value: "1 245",icon: ShoppingCart, trend: "+8.3% vs mois dernier", trendUp: true  },
//   { label: "Produit top",      value: "Riz",  icon: TrendingUp,   sub: "560 unités vendues"                      },
// ];

// export const categorieLabel: Record<CategorieProduit, string> = {
//   ALIMENTAIRE: "Alimentaire",
//   BOISSONS:    "Boissons",
//   HYGIENE:     "Hygiène",
//   VETEMENTS:   "Vêtements",
//   AUTRES:      "Autres",
// };

// // La liste des filtres = "Tous" + les labels
// export const CATEGORIES: string[] = ["Tous", ...Object.values(categorieLabel)];

// export const STOCK_BAS_SEUIL = 50;

// export function buildProduitsStats(s: ProduitsStats): StatCard[] {
//   return [
//     { label: "Total produits",  value: String(s.totalProduits),               icon: Package,        sub: "au catalogue" },
//     { label: "Valeur du stock", value: s.valeurStock.toLocaleString("fr-FR"), unit: "MRU", icon: Wallet, sub: "valeur de vos produits en stock" },
//     { label: "Stock bas",       value: String(s.stockBas),                    icon: AlertTriangle,  sub: "produits bientôt épuisés" },
//     { label: "Total vendu",     value: s.totalVendu.toLocaleString("fr-FR"),  icon: TrendingUp,     sub: "unités vendues" },
//   ];
// }