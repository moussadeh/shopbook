import { getProduits, getProduitsStats, getBoutiqueId } from "@/lib/data/produits";
import ProduitsView from "./produits-view";
import AucuneBoutique from "./aucune-boutique";

export default async function ProduitsPage() {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return <AucuneBoutique />;

  const [produits, stats] = await Promise.all([getProduits(), getProduitsStats()]);
  return <ProduitsView produits={produits} stats={stats} />;
}