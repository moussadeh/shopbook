import { StatutCredit, statusStyle } from "./dashboard";

export type { StatutCredit };
export { statusStyle };

export interface Credit {
  id:             number;
  clientInitials: string;
  clientName:     string;
  description:    string;
  montantTotal:   number;
  montantPaye:    number;
  montantRestant: number;
  status:         StatutCredit;
  date:           string;
  produits:       number;
}

export const credits: Credit[] = [
  { id: 1, clientInitials: "MA", clientName: "Mohamed Ahmed",    description: "Achat riz et sucre",   montantTotal: 4500,  montantPaye: 2000, montantRestant: 2500,  status: "Partiel",             date: "18 Mai 2025", produits: 2 },
  { id: 2, clientInitials: "SK", clientName: "Sidi Kane",        description: "Achat huile",           montantTotal: 8500,  montantPaye: 0,    montantRestant: 8500,  status: "En cours",           date: "18 Mai 2025", produits: 1 },
  { id: 3, clientInitials: "MM", clientName: "Moussa Diop",      description: "Achat lait et thé",     montantTotal: 12300, montantPaye: 0,    montantRestant: 12300, status: "En retard",          date: "17 Mai 2025", produits: 3 },
  { id: 4, clientInitials: "AM", clientName: "Aminata Mint Ali", description: "Achat sucre",           montantTotal: 2500,  montantPaye: 2500, montantRestant: 0,     status: "Payé",               date: "16 Mai 2025", produits: 1 },
  { id: 5, clientInitials: "BA", clientName: "Baba Ahmed",       description: "Achat riz",             montantTotal: 5800,  montantPaye: 0,    montantRestant: 5800,  status: "En cours",           date: "15 Mai 2025", produits: 1 },
  { id: 6, clientInitials: "FO", clientName: "Fatima Ould",      description: "Achat huile et sucre",  montantTotal: 3200,  montantPaye: 1000, montantRestant: 2200,  status: "Partiel",            date: "14 Mai 2025", produits: 2 },
  { id: 7, clientInitials: "IO", clientName: "Ibrahima Ould",    description: "Achat farine",          montantTotal: 6000,  montantPaye: 0,    montantRestant: 6000,  status: "En retard",          date: "13 Mai 2025", produits: 1 },
  { id: 8, clientInitials: "ZM", clientName: "Zeynab Mint",      description: "Achat thé et café",     montantTotal: 1800,  montantPaye: 1800, montantRestant: 0,     status: "Payé",               date: "12 Mai 2025", produits: 2 },
  { id: 9, clientInitials: "MO", clientName: "Moussa Ould",      description: "Achat riz et huile",    montantTotal: 7500,  montantPaye: 5000, montantRestant: 2500,  status: "Partiel",            date: "11 Mai 2025", produits: 2 },
  { id: 10, clientInitials: "SA", clientName: "Sadia Ahmed",      description: "Achat sucre et farine", montantTotal: 4000,  montantPaye: 0,    montantRestant: 4000,  status: "En cours",           date: "10 Mai 2025", produits: 2 },
];

export const STATUTS_CREDIT = ["Tous", "En cours", "Partiel", "En retard", "Payé"] as const;

export const summaryCards = [
  { label: "Total crédits",     value: credits.reduce((acc, c) => acc + c.montantTotal,   0), color: "text-blue-700"   },
  { label: "Total encaissé",    value: credits.reduce((acc, c) => acc + c.montantPaye,    0), color: "text-green-700"  },
  { label: "Reste à encaisser", value: credits.reduce((acc, c) => acc + c.montantRestant, 0), color: "text-orange-600" },
  { label: "En retard",         value: credits.filter((c) => c.status === "En retard").reduce((acc, c) => acc + c.montantRestant, 0), color: "text-red-600" },
];

export function formatMRU(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} MRU`;
}