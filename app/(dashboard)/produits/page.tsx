// import { getProduits, getProduitsStats } from "@/lib/data/produits";
// import ProduitsView from "./produits-view";

// export default async function ProduitsPage() {
//   const [produits, stats] = await Promise.all([getProduits(), getProduitsStats()]);
//   return <ProduitsView produits={produits} stats={stats} />;
// }

export default async function ProduitsPage() {
  return (
    <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
      <p className="text-sm text-gray-500">
        Cette page est en cours de développement. Les fonctionnalités seront bientôt disponibles.
      </p>
    </div>
  );
}
