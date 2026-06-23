import { ShoppingBag, Check } from "lucide-react";
import Image from "next/image";

const atouts = [
  "Vos crédits toujours à jour",
  "Vos clients et vos produits réunis",
  "Un tableau de bord clair, sur téléphone comme sur ordinateur",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Gauche : branding (desktop uniquement) */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-vert-foncee text-white p-10 xl:p-14">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
          <span className="text-xl font-bold">ShopBook</span>
        </div>

        <div className="relative space-y-6 max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
            Gérez les crédits de votre boutique en toute simplicité.
          </h1>
          <p className="text-white/80 leading-relaxed">
            Vos clients, vos produits et vos paiements au même endroit.
            Sachez qui vous doit quoi, à tout moment.
          </p>
          <ul className="space-y-3">
            {atouts.map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} ShopBook · Mauritanie
        </p>
      </div>

      {/* Droite : zone formulaire */}
      <div className="flex flex-col min-h-screen lg:min-h-0 bg-gray-50/60">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* En-tête mobile : logo + nom centrés (caché sur desktop, déjà présent à gauche) */}
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={70} height={70} className="object-contain rounded" />
            <span>
              <span className="font-bold tracking-tight text-2xl text-vert-foncee">Shop</span>
              <span className="font-bold tracking-tight text-2xl text-orange">Book</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
    </div>
  );
}