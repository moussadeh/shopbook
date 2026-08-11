import { Package, CheckCircle2, XCircle, ImageIcon } from "lucide-react";
import type { StatCard } from "@/components/custom/dashboard/stats-cards";
import type { ProduitsStats } from "@/lib/data/produits";

export function buildProduitsStats(s: ProduitsStats): StatCard[] {
  return [
    { label: "Produits",      value: String(s.total),          icon: Package,      sub: "au catalogue" },
    { label: "Disponibles",   value: String(s.disponibles),    icon: CheckCircle2, sub: "en vente" },
    { label: "Indisponibles", value: String(s.indisponibles),  icon: XCircle,      sub: "en rupture" },
    { label: "Avec photo",    value: String(s.avecImage),      icon: ImageIcon,    sub: "illustrés" },
  ];
}
