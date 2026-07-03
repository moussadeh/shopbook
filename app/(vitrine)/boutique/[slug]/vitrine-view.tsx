import { Store, MapPin, Phone, Truck, ShoppingBag } from "lucide-react";
import type { Vitrine } from "@/lib/data/boutique-publique";
import ProduitCard from "./produit-card";
import Image from "next/image";

export default function VitrineView({ vitrine }: { vitrine: Vitrine }) {
  const nbDispo = vitrine.produits.filter((p) => p.disponible).length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* En-tête boutique */}
      <header className="bg-vert-foncee text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-6 space-y-4">
          <div className="flex items-start gap-3">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">{vitrine.nom}</h1>
              {vitrine.description && (
                <p className="text-white/80 text-sm mt-1 leading-relaxed">{vitrine.description}</p>
              )}
            </div>
          </div>

          {/* Infos pratiques */}
          <div className="flex flex-wrap gap-2">
            {vitrine.quartier && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 rounded-full px-3 py-1.5">
                <MapPin size={13} /> {vitrine.quartier}
              </span>
            )}
            {vitrine.telephone && (
              <a href={`tel:${vitrine.telephone}`} className="inline-flex items-center gap-1.5 text-xs bg-white/15 rounded-full px-3 py-1.5 hover:bg-white/25 transition">
                <Phone size={13} /> {vitrine.telephone}
              </a>
            )}
            {vitrine.retrait && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 rounded-full px-3 py-1.5">
                <ShoppingBag size={13} /> Retrait
              </span>
            )}
            {vitrine.livraison && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 rounded-full px-3 py-1.5">
                <Truck size={13} /> Livraison
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Produits */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">Nos produits</h2>
          <span className="text-xs text-muted-foreground">{nbDispo} disponible{nbDispo > 1 ? "s" : ""}</span>
        </div>

        {vitrine.produits.length === 0 ? (
          <div className="bg-white rounded-2xl border py-16 text-center text-muted-foreground text-sm">
            Cette boutique n&apos;a pas encore de produits.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {vitrine.produits.map((p) => (
              <ProduitCard key={p.id} produit={p} />
            ))}
          </div>
        )}
      </main>

      {/* Pied */}
      <footer className="max-w-3xl mx-auto px-4 md:px-6 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Propulsé par <span className="font-semibold text-vert-foncee">ShopBook</span>
        </p>
      </footer>
    </div>
  );
}