import {
  Check,
  ShieldCheck,
  RefreshCcw,
  Headset,
  Clock3,
  Star,
  BadgeDollarSign,
} from "lucide-react"

export default function Pricing() {
  return (
    <section id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-10 bg-muted">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

        {/* Header */}
        <div className="space-y-2 md:text-center md:max-w-3xl md:mx-auto">
          <div className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-md font-medium text-vert-foncee gap-2">
            <BadgeDollarSign size={18} /> Tarifs simples et transparents
          </div>
          <h2 className="text-2xl md:text-4xl font-bold leading-tight">
            Choisissez le plan qui<br />convient à <span className="text-vert-foncee">votre boutique</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed md:max-w-xl md:mx-auto">
            Une offre claire, pensée pour les commerçants mauritaniens.<br />
            Aucun engagement. Paiement par Bankily, Masrvi ou Sedad.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

          {/* Découverte */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-5 md:space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">Découverte</h3>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-bold">Gratuit</span>
                </div>
                <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  <Clock3 size={14} className="mr-2" />Pendant 14 jours
                </div>
                <p className="mt-2 text-slate-600 text-sm md:text-base">
                  Essayez tout ShopBook, sans payer, sans engagement.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                {[
                  "Tous vos crédits clients au même endroit",
                  "Vos clients et vos produits, en illimité",
                  "Suivi des paiements et statut automatique",
                  "Tableau de bord complet",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-full bg-vert-claire p-1 shrink-0">
                      <Check size={13} className="text-vert-foncee" />
                    </div>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-vert-claire p-3">
                <p className="text-sm text-slate-600">
                  Aucun paiement à l&apos;inscription.
                </p>
              </div>

              <button className="cursor-pointer w-full rounded-xl border border-vert-foncee py-3 font-medium text-vert-foncee transition hover:bg-vert-claire text-sm md:text-base">
                Commencer gratuitement
              </button>
            </div>
          </div>

          {/* Essentiel */}
          <div className="relative rounded-3xl border-2 border-vert-foncee bg-white p-6 md:p-8 shadow-xl md:scale-[1.02]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="rounded-full bg-vert-foncee px-4 py-2 text-sm font-medium text-white whitespace-nowrap">
                Standard
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Essentiel</h3>
                <div className="mt-0 flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-bold">300</span>
                  <span className="pb-1 text-lg text-slate-600">MRU / mois</span>
                </div>
                <div className="mt-2 inline-flex items-center rounded-full bg-vert-claire px-3 py-1 text-sm text-vert-foncee">
                  <Star size={14} className="mr-2" />Le plus populaire
                </div>
                <p className="mt-2 text-slate-600 leading-7 text-sm md:text-base">
                  Tout ShopBook pour gérer votre activité, sans limite de temps.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <p className="text-slate-700 font-medium text-sm mb-3">Tout ce que contient l&apos;essai, plus :</p>
                {[
                  "Statistiques détaillées de votre activité",
                  "Historique complet de vos crédits et paiements",
                  "Export de vos données",
                  "Sauvegarde automatique de vos données",
                  "Aide rapide quand vous en avez besoin",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-full bg-vert-claire p-1 shrink-0">
                      <Check size={13} className="text-vert-foncee" />
                    </div>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button className="cursor-pointer w-full rounded-xl bg-vert-foncee py-3 font-medium text-white transition hover:bg-[#17441d] text-sm md:text-base">
                Choisir le plan Essentiel
              </button>
            </div>
          </div>

          {/* Équipe */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-5 md:space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Équipe</h3>
                <div className="mt-0 flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-bold">300</span>
                  <span className="pb-1 text-lg text-slate-600">MRU / mois</span>
                </div>
                <div className="mt-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  +100 MRU par salarié
                </div>
                <p className="mt-2 text-slate-600 leading-7 text-sm md:text-base">
                  Pour gérer votre boutique à plusieurs.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <p className="text-slate-700 font-medium text-sm mb-3">Tout l&apos;Essentiel, plus :</p>
                {[
                  "Un compte pour chaque salarié",
                  "Les droits d'accès que vous définissez",
                  "Vous voyez toujours qui a noté quoi",
                  "Collaboration en temps réel",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="rounded-full bg-vert-claire p-1 shrink-0">
                      <Check size={13} className="text-vert-foncee" />
                    </div>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button className="cursor-pointer w-full rounded-xl border border-vert-foncee py-3 font-medium text-vert-foncee transition hover:bg-[#f5f9f3] text-sm md:text-base">
                Choisir le plan Équipe
              </button>
            </div>
          </div>

        </div>

        {/* Garanties */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          {[
            {
              icon: <ShieldCheck size={22} className="text-[#1d5524]" />,
              title: "Vos données en sécurité",
              desc: "Tout est sauvegardé automatiquement. Vous ne perdez jamais vos crédits, contrairement à un cahier.",
            },
            {
              icon: <RefreshCcw size={22} className="text-[#1d5524]" />,
              title: "Sans engagement",
              desc: "Vous payez le mois quand vous voulez continuer. Rien ne se renouvelle dans votre dos.",
            },
            {
              icon: <Headset size={22} className="text-[#1d5524]" />,
              title: "Une équipe à vos côtés",
              desc: "Une question, un souci ? On vous répond rapidement, par téléphone ou par mail. On est là pour vous.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="h-fit rounded-2xl bg-[#e7f0e2] p-3 shrink-0">
                {icon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm md:text-base">{title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}