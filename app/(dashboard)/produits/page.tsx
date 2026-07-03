import { getProduits, getProduitsStats } from "@/lib/data/produits";
import ProduitsView from "./produits-view";

export default async function ProduitsPage() {
  const [produits, stats] = await Promise.all([getProduits(), getProduitsStats()]);
  return <ProduitsView produits={produits} stats={stats} />;
}



// import { getProduits, getProduitsStats } from "@/lib/data/produits";
// import ProduitsView from "./produits-view";

// export default async function ProduitsPage() {
//   const [produits, stats] = await Promise.all([getProduits(), getProduitsStats()]);
//   return <ProduitsView produits={produits} stats={stats} />;
// }
