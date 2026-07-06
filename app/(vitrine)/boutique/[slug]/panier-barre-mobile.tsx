"use client";

import { ShoppingCart, X } from "lucide-react";
import type { LignePanier } from "./vitrine-view";
import PanierPanel from "./panier-panel";

type Props = {
  nbArticles: number;
  total: number;
  ouvert: boolean;
  onOuvrir: () => void;
  onFermer: () => void;
  lignes: LignePanier[];
  onChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
};

export default function PanierBarreMobile({ nbArticles, total, ouvert, onOuvrir, onFermer, lignes, onChange, onRemove }: Props) {
  return (
    <div className="lg:hidden">
      {/* Barre flottante */}
      <button
        onClick={onOuvrir}
        className="fixed bottom-4 left-4 right-4 z-40 h-14 rounded-2xl bg-vert-foncee text-white shadow-lg flex items-center justify-between px-5"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-vert-foncee text-xs font-bold flex items-center justify-center">
              {nbArticles}
            </span>
          </span>
          Voir le panier
        </span>
        <span className="font-bold">{total} MRU</span>
      </button>

      {/* Panneau plein écran */}
      {ouvert && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onFermer}>
          <div className="bg-gray-50 w-full max-h-[85vh] rounded-t-3xl p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Votre panier</h3>
              <button onClick={onFermer} className="w-8 h-8 rounded-full border flex items-center justify-center" aria-label="Fermer">
                <X size={16} />
              </button>
            </div>
            <PanierPanel lignes={lignes} total={total} onChange={onChange} onRemove={onRemove} />
          </div>
        </div>
      )}
    </div>
  );
}