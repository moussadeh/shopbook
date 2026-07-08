"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import type { Vitrine, VitrineProduit } from "@/lib/data/boutique-publique";
import VitrineHero from "./vitrine-hero";
import ProduitCard from "./produit-card";
import PanierPanel from "./panier-panel";
import PanierBarreMobile from "./panier-barre-mobile";
import CheckoutModal from "./checkout-modal";
import Image from "next/image";
import AcheteurMenu from "../../acheteur-menu";

export type LignePanier = { produit: VitrineProduit; qte: number };

const LOT = 9;

export default function VitrineView({
  vitrine,
  slug,
  acheteur,
}: {
  vitrine: Vitrine;
  slug: string;
  acheteur: { id: number; nom: string; telephone: string } | null;
}) {
  const dejaConnecte = !!acheteur;
  const [search, setSearch] = useState("");
  const [tri, setTri] = useState<"recent" | "prix-asc" | "prix-desc">("recent");
  const [visibles, setVisibles] = useState(LOT);
  const [panier, setPanier] = useState<Record<number, LignePanier>>({});
  const [panierMobileOuvert, setPanierMobileOuvert] = useState(false);
  const [checkoutOuvert, setCheckoutOuvert] = useState(false);

  const lignes = Object.values(panier);
  const nbArticles = lignes.reduce((s, l) => s + l.qte, 0);
  const total = lignes.reduce((s, l) => s + l.produit.prix * l.qte, 0);

  const ajouter = (p: VitrineProduit) =>
    setPanier((prev) => ({ ...prev, [p.id]: { produit: p, qte: (prev[p.id]?.qte ?? 0) + 1 } }));

  const changerQte = (id: number, delta: number) =>
    setPanier((prev) => {
      const actuel = prev[id];
      if (!actuel) return prev;
      const qte = actuel.qte + delta;
      if (qte <= 0) { const c = { ...prev }; delete c[id]; return c; }
      return { ...prev, [id]: { ...actuel, qte } };
    });

  const retirer = (id: number) =>
    setPanier((prev) => { const c = { ...prev }; delete c[id]; return c; });

  const viderPanier = () => setPanier({});

  // Ouvre le checkout (ferme le panier mobile s'il était ouvert)
  const ouvrirCheckout = () => {
    setPanierMobileOuvert(false);
    setCheckoutOuvert(true);
  };

  const produitsFiltres = useMemo(() => {
    let list = vitrine.produits.filter((p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    if (tri === "prix-asc") list = [...list].sort((a, b) => a.prix - b.prix);
    if (tri === "prix-desc") list = [...list].sort((a, b) => b.prix - a.prix);
    return list;
  }, [vitrine.produits, search, tri]);

  const produits = produitsFiltres.slice(0, visibles);
  const resteAafficher = produitsFiltres.length - produits.length;

  const onSearch = (v: string) => { setSearch(v); setVisibles(LOT); };
  const onTri = (v: typeof tri) => { setTri(v); setVisibles(LOT); };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-24 lg:pb-10">
      {/* En-tête : logo + panier */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
            <span className="font-bold text-lg">
              <span className="text-vert-foncee">Shop</span><span className="text-orange">Book</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {acheteur && (
              <div>
                <AcheteurMenu nom={acheteur.nom} />
              </div>
            )}
            {/* <button
              onClick={() => setPanierMobileOuvert(true)}
              className="lg:hidden relative w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-muted transition"
              aria-label="Voir le panier"
            >
              <ShoppingCart size={18} className="text-gray-700" />
              {nbArticles > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center">
                  {nbArticles}
                </span>
              )}
            </button> */}
          </div>
        </div>
      </div>

      <VitrineHero vitrine={vitrine} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Produits */}
          <div>
            <h2 className="text-lg font-bold text-vert-foncee mb-4">Nos produits</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl border bg-white text-sm outline-none focus:border-vert-foncee transition"
                />
              </div>
              <select
                value={tri}
                onChange={(e) => onTri(e.target.value as typeof tri)}
                className="h-11 px-3 rounded-xl border bg-white text-sm outline-none focus:border-vert-foncee transition"
              >
                <option value="recent">Plus récents</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>

            {produitsFiltres.length === 0 ? (
              <div className="bg-white rounded-2xl border py-16 text-center text-muted-foreground text-sm">
                Aucun produit trouvé.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
                  {produits.map((p) => (
                    <ProduitCard key={p.id} produit={p} qte={panier[p.id]?.qte ?? 0} onAdd={() => ajouter(p)} onChange={changerQte} />
                  ))}
                </div>

                {resteAafficher > 0 && (
                  <button
                    onClick={() => setVisibles((v) => v + LOT)}
                    className="mt-5 w-full h-11 rounded-xl bg-white border text-sm font-semibold text-vert-foncee hover:bg-green-50 transition"
                  >
                    Voir plus de produits ({resteAafficher})
                  </button>
                )}
              </>
            )}
          </div>

          {/* Panier desktop */}
          <div className="hidden lg:block sticky top-20">
            <PanierPanel lignes={lignes} total={total} onChange={changerQte} onRemove={retirer} onCheckout={ouvrirCheckout} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Propulsé par <span className="font-semibold text-vert-foncee">ShopBook</span>
        </p>
      </main>

      {nbArticles > 0 && (
        <PanierBarreMobile
          nbArticles={nbArticles}
          total={total}
          ouvert={panierMobileOuvert}
          onOuvrir={() => setPanierMobileOuvert(true)}
          onFermer={() => setPanierMobileOuvert(false)}
          lignes={lignes}
          onChange={changerQte}
          onRemove={retirer}
          onCheckout={ouvrirCheckout}
        />
      )}

      {/* Modale de commande */}
      <CheckoutModal
        ouvert={checkoutOuvert}
        onFermer={() => setCheckoutOuvert(false)}
        slug={slug}
        lignes={lignes}
        total={total}
        dejaConnecte={dejaConnecte}
        livraison={vitrine.livraison}
        retrait={vitrine.retrait}
        onCommandeOk={viderPanier}
      />
    </div>
  );
}