import { Link } from "lucide-react";

const products = [
  { name: "Sucre 1kg",       qty: 560 },
  { name: "Riz Parfumé 5kg", qty: 420 },
  { name: "Huile 1L",        qty: 380 },
  { name: "Lait en poudre",  qty: 310 },
  { name: "Thé 250g",        qty: 280 },
];

export default function ProductsList() {
    return (
        <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Produits les plus vendus</h2>
              <span className="text-xs text-muted-foreground font-medium">Quantité vendue</span>
            </div>
            <div className="divide-y">
              {products.map((p, i) => {
                const maxQty = products[0].qty;
                const pct = Math.round((p.qty / maxQty) * 100);
                return (
                  <div key={p.name} className="px-4 md:px-5 py-3 flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-vert-foncee"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 shrink-0">{p.qty}</span>
                  </div>
                );
              })}
            </div>
            <div className="px-4 md:px-5 py-3 border-t">
              <Link href="/produits">
                <button className="w-full text-xs font-semibold text-vert-foncee border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors">
                  Voir tous les produits
                </button>
              </Link>
            </div>
          </div>
    );
}