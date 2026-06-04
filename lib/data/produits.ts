export type UniteProduit = "KILO" | "LITRE" | "SACHET" | "PAQUET" | "SAC" | "BIDON" | "UNITE";

export const uniteLabel: Record<UniteProduit, string> = {
  KILO:   "kg",
  LITRE:  "L",
  SACHET: "sachet",
  PAQUET: "paquet",
  SAC:    "sac",
  BIDON:  "bidon",
  UNITE:  "unité",
};

export interface Produit {
  id:           number;
  nom:          string;
  prixUnitaire: number;
  unite:        UniteProduit;
  stock:        number;
  vendu:        number;
  categorie:    string;
}

export const produits: Produit[] = [
  { id: 1, nom: "Riz Parfumé 5kg",  prixUnitaire: 20,  unite: "KILO",   stock: 150, vendu: 560, categorie: "Alimentation" },
  { id: 2, nom: "Sucre 1kg",        prixUnitaire: 20,  unite: "KILO",   stock: 200, vendu: 420, categorie: "Alimentation" },
  { id: 3, nom: "Huile 1L",         prixUnitaire: 20,  unite: "LITRE",  stock: 80,  vendu: 380, categorie: "Alimentation" },
  { id: 4, nom: "Lait en poudre",   prixUnitaire: 10,  unite: "SACHET", stock: 120, vendu: 310, categorie: "Alimentation" },
  { id: 5, nom: "Thé vert",         prixUnitaire: 20,  unite: "PAQUET", stock: 90,  vendu: 280, categorie: "Boissons"     },
  { id: 6, nom: "Café instantané",  prixUnitaire: 15,  unite: "SACHET", stock: 60,  vendu: 210, categorie: "Boissons"     },
  { id: 7, nom: "Savon",            prixUnitaire: 5,   unite: "UNITE",  stock: 300, vendu: 195, categorie: "Hygiène"      },
  { id: 8, nom: "Farine 50kg",      prixUnitaire: 200, unite: "SAC",    stock: 40,  vendu: 140, categorie: "Alimentation" },
  { id: 9, nom: "Tomate concentrée",prixUnitaire: 8,   unite: "UNITE",  stock: 180, vendu: 130, categorie: "Alimentation" },
  { id: 10,nom: "Eau minérale 1.5L",prixUnitaire: 12,  unite: "LITRE",  stock: 25,  vendu: 110, categorie: "Boissons"     },
];

export const CATEGORIES = ["Tous", "Alimentation", "Boissons", "Hygiène"] as const;

export const STOCK_BAS_SEUIL = 50;

import { Package, TrendingUp, AlertTriangle, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/custom/dashboard/stats-cards";
 
export const produitsStats: StatCard[] = [
  { label: "Total produits",   value: "320",  icon: Package,      sub: "en catalogue"                           },
  { label: "Stock bas",        value: "12",   icon: AlertTriangle,trend: "sous le seuil",    trendUp: false      },
  { label: "Ventes ce mois",   value: "1 245",icon: ShoppingCart, trend: "+8.3% vs mois dernier", trendUp: true  },
  { label: "Produit top",      value: "Riz",  icon: TrendingUp,   sub: "560 unités vendues"                      },
];