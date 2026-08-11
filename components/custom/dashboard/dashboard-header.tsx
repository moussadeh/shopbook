import { getCommercant } from "@/lib/data/commercant";
import CommercantMenu from "./commercant-menu";

export default async function DashboardHeader() {
  const commercant = await getCommercant();
  const initiale = (commercant?.prenom?.[0] ?? "?").toUpperCase();

  return (
    <header className="mt-14 lg:mt-0 lg:sticky lg:top-0 z-30 bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-base md:text-lg font-bold text-gray-900">
          Bonjour, {commercant?.prenom ?? ""} !
        </h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Voici un aperçu de votre activité aujourd&apos;hui.
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <CommercantMenu
          initiale={initiale}
          prenom={commercant?.prenom ?? ""}
          nomComplet={`${commercant?.prenom ?? ""} ${commercant?.nom ?? ""}`.trim()}
          nomBoutique={commercant?.nomBoutique ?? null}
        />
      </div>
    </header>
  );
}