import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export default function AucuneBoutique() {
  return (
    <div className="px-4 md:px-6 py-5 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border p-8 md:p-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-green-50 text-vert-foncee flex items-center justify-center mx-auto">
          <Store size={30} />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            Ouvrez d&apos;abord votre boutique
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Vos produits sont présentés dans votre boutique en ligne. Créez-la en quelques secondes,
            puis revenez ajouter votre premier produit.
          </p>
        </div>

        <Link
          href="/ma-boutique"
          className="inline-flex items-center gap-2 bg-vert-foncee text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Créer ma boutique <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}