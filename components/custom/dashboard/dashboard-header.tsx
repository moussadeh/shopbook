import { getCommercant } from "@/lib/data/commercant";
import { ChevronDown } from "lucide-react";
import CommercantMenu from "./commercant-menu";

export default async function DashboardHeader() {
  const commercant = await getCommercant();
  const initiale = (commercant?.prenom?.[0] ?? "?").toUpperCase();

  return (
      <header className="mt-14 lg:mt-0 lg:sticky lg:top-0 z-30 bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      <div className="">
        <h1 className="text-base md:text-lg font-bold text-gray-900">
          Bonjour, {commercant?.prenom ?? ""} !
        </h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Voici un aperçu de votre boutique aujourd&apos;hui.
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* <button className="flex items-center gap-2 border rounded-xl px-2 py-1.5 hover:bg-muted transition-colors">
          <div className="w-7 h-7 rounded-full bg-vert-foncee flex items-center justify-center text-white text-xs font-bold">
            {initiale}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">Boutique {commercant?.prenom ?? ""}</span>
          <ChevronDown size={14} className="text-gray-500 hidden md:block" />
        </button> */}
        <CommercantMenu initiale={initiale} nomBoutique={commercant?.nomBoutique ?? ""} />
      </div>
    </header>
  );
}