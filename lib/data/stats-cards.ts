// // lib/data/dashboard.ts
// import { CreditCard as CreditCardIcon, Download as DownloadIcon, Users as UsersIcon, Package as PackageIcon } from "lucide-react";
// import { StatCard } from "@/components/custom/dashboard/stats-cards";

// export const dashboardStats: StatCard[] = [
//   { label: "Crédits actifs",  value: "125 500", unit: "MRU", icon: CreditCardIcon, trend: "+12.5% ce mois", trendUp: true  },
//   { label: "Paiements reçus", value: "75 300",  unit: "MRU", icon: DownloadIcon,   trend: "+8.2% ce mois",  trendUp: true  },
//   { label: "Clients",         value: "248",      unit: "",    icon: UsersIcon,       trend: "+18.7%",         trendUp: true  },
//   { label: "Produits",        value: "320",      unit: "",    icon: PackageIcon,     sub: "en catalogue",                    },
// ];

// // lib/data/clients.ts
// import { Users, CreditCard, CalendarDays, TrendingUp } from "lucide-react";
// import {}
// import { StatCard } from "@/components/custom/dashboard/stats-cards";

// export const clientsStats: StatCard[] = [
//   { label: "Total clients",         value: "248",      icon: UsersIcon,         sub: "enregistrés"                        },
//   { label: "Clients avec crédits",  value: "186",      icon: CreditCardIcon,    trend: "+5 ce mois",    trendUp: true     },
//   { label: "Nouveaux ce mois",      value: "12",       icon: CalendarDaysIcon,  trend: "+3 vs mois dernier", trendUp: true },
//   { label: "Total crédits",         value: "36 800",   unit: "MRU", icon: TrendingUp, sub: "encours global"           },
// ];

// // lib/data/credits.ts
// import { CreditCard, Download, Clock, AlertTriangle } from "lucide-react";
// import { StatCard } from "@/components/custom/dashboard/stats-cards";

// export const creditsStats: StatCard[] = [
//   { label: "Total crédits",     value: "36 800", unit: "MRU", icon: CreditCard,    sub: "montant global"              },
//   { label: "Total encaissé",    value: "5 500",  unit: "MRU", icon: Download,      trend: "+2 300 ce mois", trendUp: true },
//   { label: "Reste à encaisser", value: "31 300", unit: "MRU", icon: Clock,         sub: "en attente"                  },
//   { label: "En retard",         value: "18 300", unit: "MRU", icon: AlertTriangle, trend: "2 crédits",      trendUp: false },
// ];

// // lib/data/produits.ts
// import { Package, TrendingUp, AlertTriangle, ShoppingCart } from "lucide-react";
// import { StatCard } from "@/components/custom/dashboard/stats-cards";

// export const produitsStats: StatCard[] = [
//   { label: "Total produits",   value: "320",  icon: Package,      sub: "en catalogue"                           },
//   { label: "Stock bas",        value: "12",   icon: AlertTriangle,trend: "sous le seuil",    trendUp: false      },
//   { label: "Ventes ce mois",   value: "1 245",icon: ShoppingCart, trend: "+8.3% vs mois dernier", trendUp: true  },
//   { label: "Produit top",      value: "Riz",  icon: TrendingUp,   sub: "560 unités vendues"                      },
// ];