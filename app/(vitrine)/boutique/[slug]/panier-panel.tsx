import { X, Plus, Minus, ClipboardCheck, ShoppingCart } from "lucide-react";
import type { LignePanier } from "./vitrine-view";

type Props = {
  lignes: LignePanier[];
  total: number;
  onChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
};

export default function PanierPanel({ lignes, total, onChange, onRemove, onCheckout }: Props) {
  const nb = lignes.reduce((s, l) => s + l.qte, 0);

  return (
    <div className="bg-vert-claire-2 rounded-2xl border p-4 space-y-4">
      <h3 className="font-bold text-gray-900">Votre commande {nb > 0 && `(${nb})`}</h3>

      {lignes.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <ShoppingCart size={28} className="mx-auto text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">Votre panier est vide.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {lignes.map(({ produit, qte }) => (
              <div key={produit.id} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                  {produit.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={produit.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{produit.nom}</p>
                  <p className="text-sm font-bold text-gray-900">{produit.prix * qte} MRU</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => onChange(produit.id, -1)} className="w-6 h-6 rounded-md border flex items-center justify-center" aria-label="Moins">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{qte}</span>
                  <button onClick={() => onChange(produit.id, 1)} className="w-6 h-6 rounded-md bg-vert-foncee text-white flex items-center justify-center" aria-label="Plus">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => onRemove(produit.id)} className="text-muted-foreground hover:text-red-600 transition shrink-0" aria-label="Retirer">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold text-gray-900">{total} MRU</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full h-11 rounded-xl bg-vert-foncee text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Passer la commande
          </button>

          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
            <ClipboardCheck size={16} className="text-vert-foncee shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Commande simple et rapide. Le commerçant vous contacte pour confirmer, et vous payez à la réception.
            </p>
          </div>
        </>
      )}
    </div>
  );
}