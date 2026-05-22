import {
  Check,
  ShieldCheck,
  RefreshCcw,
  Headset,
  Clock3,
  Star,
} from "lucide-react"

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 md:px-12 py-10 bg-muted">
      <div className="max-w-7xl mx-auto space-y-16">

        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-md font-medium text-vert-foncee">
            Tarifs simples et transparents
          </div>

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Choisissez le plan qui<br />convient à <span className="text-vert-foncee">votre boutique</span>
          </h2>

          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Gérez vos crédits clients facilement avec une solution moderne pensée pour les commerçants mauritaniens.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-6">

                <div>
                <h3 className="text-2xl font-semibold">Découverte</h3>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-4xl font-bold">Gratuit</span>
                </div>

                <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  <Clock3 size={14} className="mr-2" />Pendant 2 semaines
                </div>

                <p className="mt-2 text-slate-600">
                  Testez toutes les fonctionnalités de Shopbook sans engagement.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                {[
                  "Gestion des crédits clients",
                  "Gestion des clients",
                  "Gestion des produits",
                  "Enregistrement des paiements",
                  "Tableau de bord basique",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-full bg-vert-claire p-1">
                      <Check size={15} className="text-vert-foncee"/>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-vert-claire p-3">
                <p className="text-sm text-slate-600">
                  Accès complet à toutes les fonctionnalités pendant 2 semaines.
                </p>
              </div>

              <button className="w-full rounded-xl border border-vert-foncee py-3 font-medium text-vert-foncee transition hover:bg-vert-claire">
                Commencer gratuitement
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl border-2 border-vert-foncee bg-white p-8 shadow-xl scale-[1.02]">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="rounded-full bg-vert-foncee px-4 py-2 text-sm font-medium text-white">
                Standard
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Essentiel</h3>

                <div className="mt-0 flex items-end gap-2">
                    <span className="text-4xl font-bold">200</span>
                    <span className="pb-1 text-xl text-slate-600">MRU / mois</span>
                </div>

                <div className="mt-2 inline-flex items-center rounded-full bg-vert-claire px-3 py-1 text-sm text-vert-foncee">
                  <Star size={14} className="mr-2" />Le plus populaire
                </div>

                <p className="mt-2 text-slate-600 leading-7">
                  Accédez à toutes les fonctionnalités pour
                  gérer votre boutique sans limite.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="mb-4 mt-1">
                  <p className="text-slate-700 font-medium text-sm">Tout ce qui est inclus dans découverte, plus:</p>
                </div>
                {[
                  "Accès illimité",
                  "Statistiques avancées",
                  "Historique complet",
                  "Export des données",
                  "Sauvegarde automatique",
                  "Support prioritaire",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-full bg-vert-claire p-1">
                      <Check size={15} className="text-vert-foncee"/>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full rounded-xl bg-vert-foncee py-3 font-medium text-white transition hover:bg-[#17441d]">
                Choisir le plan Essentiel
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-6">

              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Équipe</h3>

                <div className="mt-0 flex items-end gap-2">
                  <span className="text-4xl font-bold">200</span>
                  <span className="pb-1 text-lg text-slate-600">MRU / mois</span>
                </div>

                <div className="mt-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  +100 MRU par salarié
                </div>

                <p className="mt-2 text-slate-600 leading-7">
                  Ajoutez vos salariés et gérez votre
                  boutique en équipe.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="mb-4 mt-1">
                  <p className="text-slate-700 font-medium text-sm">Tout ce qui est inclus dans essentiel, plus:</p>
                </div>
                {[
                  "Gestion des salariés",
                  "Comptes salariés",
                  "Permissions personnalisées",
                  "Suivi des activités",
                  "Collaboration en temps réel",
                  "Tarification flexible",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="rounded-full bg-vert-claire p-1">
                      <Check size={15} className="text-vert-foncee"/>
                    </div>

                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full rounded-xl border border-vert-foncee py-3 font-medium text-vert-foncee transition hover:bg-[#f5f9f3]">
                Choisir le plan Équipe
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 rounded-3xl border border-slate-200 bg-white p-8">

          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-[#e7f0e2] p-3">
              <ShieldCheck
                size={24}
                className="text-[#1d5524]"
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                Paiement sécurisé
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Vos données et paiements sont sécurisés.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-[#e7f0e2] p-3">
              <RefreshCcw
                size={24}
                className="text-[#1d5524]"
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                Annulez à tout moment
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Modifiez votre abonnement quand vous voulez.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-fit rounded-2xl bg-[#e7f0e2] p-3">
              <Headset
                size={24}
                className="text-[#1d5524]"
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900">
                Support disponible
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Notre équipe vous accompagne à chaque étape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}