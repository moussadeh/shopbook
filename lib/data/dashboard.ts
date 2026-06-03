export type StatutCredit = "En cours" | "Partiel" | "En retard" | "Payé";

export function statusStyle(status: StatutCredit): string {
  switch (status) {
    case "En cours":           return "bg-green-100 text-green-700";
    case "Partiel":            return "bg-orange-100 text-orange-600";
    case "En retard":          return "bg-red-100 text-red-600";
    case "Payé":               return "bg-gray-100 text-gray-600";
  }
}