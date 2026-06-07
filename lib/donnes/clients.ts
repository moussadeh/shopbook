

// -------------------------------------------------------

import { StatutCredit, statusStyle } from "./dashboard";

export type { StatutCredit };
export { statusStyle };

export interface Client {
  id: number;
  initials: string;
  name: string;
  phone: string;
  email?: string;
  creditTotal: string;
  creditCount: number;
  status: StatutCredit;
  lastActivity: string;
}

export const clients: Client[] = [
  { id: 1, initials: "MA", name: "Mohamed Ahmed",    phone: "+222 44 11 22 33", email: "m.ahmed@email.com", creditTotal: "4 500 MRU",  creditCount: 2, status: "Partiel",            lastActivity: "18 Mai 2025" },
  { id: 2, initials: "SK", name: "Sidi Kane",        phone: "+222 44 11 22 44", email: "",                  creditTotal: "8 500 MRU",  creditCount: 1, status: "En cours",           lastActivity: "18 Mai 2025" },
  { id: 3, initials: "MD", name: "Moussa Diop",      phone: "+222 44 11 22 55", email: "m.diop@email.com",  creditTotal: "12 300 MRU", creditCount: 3, status: "En retard",          lastActivity: "17 Mai 2025" },
  { id: 4, initials: "AM", name: "Aminata Mint Ali", phone: "+222 44 11 22 66", email: "",                  creditTotal: "2 500 MRU",  creditCount: 1, status: "Payé",               lastActivity: "16 Mai 2025" },
  { id: 5, initials: "BA", name: "Baba Ahmed",       phone: "+222 44 11 22 77", email: "b.ahmed@email.com", creditTotal: "5 800 MRU",  creditCount: 2, status: "En cours",           lastActivity: "15 Mai 2025" },
  { id: 6, initials: "FO", name: "Fatima Ould",      phone: "+222 44 11 22 88", email: "",                  creditTotal: "3 200 MRU",  creditCount: 1, status: "En cours",           lastActivity: "14 Mai 2025" },
  { id: 7, initials: "MD", name: "Mamadou Diallo",   phone: "+222 44 11 22 99", email: "m.diallo@email.com", creditTotal: "6 000 MRU",  creditCount: 2, status: "En cours",          lastActivity: "13 Mai 2025" },
  { id: 8, initials: "SA", name: "Seydou Aboubacar", phone: "+222 44 11 22 00", email: "",                  creditTotal: "9 500 MRU",  creditCount: 3, status: "Partiel",            lastActivity: "12 Mai 2025" },
  { id: 9, initials: "KH", name: "Khadija Hamid",    phone: "+222 44 11 22 11", email: "k.hamid@email.com", creditTotal: "7 200 MRU",  creditCount: 2, status: "En cours",           lastActivity: "11 Mai 2025" },
  { id: 10, initials: "IB", name: "Ibrahim Boubacar", phone: "+222 44 11 22 22", email: "",                  creditTotal: "4 800 MRU",  creditCount: 1, status: "En retard",          lastActivity: "10 Mai 2025" },
  { id: 11, initials: "AD", name: "Awa Diallo",       phone: "+222 44 11 22 33", email: "a.diallo@email.com", creditTotal: "5 000 MRU",  creditCount: 2, status: "En cours",           lastActivity: "9 Mai 2025" },
  { id: 12, initials: "MO", name: "Moussa Ould",      phone: "+222 44 11 22 44", email: "",                  creditTotal: "3 500 MRU",  creditCount: 1, status: "Payé",               lastActivity: "8 Mai 2025" },
];

export const STATUTS = ["Tous", "En cours", "Partiel", "En retard", "Payé"] as const;

import { Users, CreditCard, CalendarDays, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/custom/dashboard/stats-cards";
 
export const clientsStats: StatCard[] = [
  { label: "Total clients",         value: "248",      icon: Users,         sub: "enregistrés"                        },
  { label: "Clients avec crédits",  value: "186",      icon: CreditCard,    trend: "+5 ce mois",    trendUp: true     },
  { label: "Nouveaux ce mois",      value: "12",       icon: CalendarDays,  trend: "+3 vs mois dernier", trendUp: true },
  { label: "Total crédits",         value: "36 800",   unit: "MRU", icon: TrendingUp, sub: "encours global"           },
];

// -------------------------------------------------------