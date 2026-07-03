import Link from "next/link";
import { Store } from "lucide-react";

export default function BoutiqueFermee() {
  return (
    <div className="min-h-screen bg-gray-50/60 flex items-center justify-center p-6">
      <div className="max-w-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center mx-auto">
          <Store size={28} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Boutique momentanément fermée</h1>
        <p className="text-sm text-muted-foreground">
          Cette boutique n&apos;est pas accessible pour le moment. Revenez un peu plus tard.
        </p>
        <Link href="/" className="inline-block text-sm font-semibold text-vert-foncee hover:underline">
          Découvrir ShopBook
        </Link>
      </div>
    </div>
  );
}