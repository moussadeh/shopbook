import Link from "next/link";
import {
  Users, Package, CreditCard, LayoutDashboard,
  BookOpen, ShieldCheck, Smartphone, HandCoins,
} from "lucide-react";

export const metadata = {
  title: "À propos · ShopBook",
};

export default function AProposPage() {
  return (
    <article className="space-y-12">
      {/* Accroche */}
      <header className="text-center space-y-4 pt-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full bg-green-50 text-vert-foncee">
          <BookOpen size={15} /> À propos de ShopBook
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Le carnet de crédits de la boutique,<br className="hidden sm:block" /> enfin sur votre téléphone.
        </h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          ShopBook aide les commerçants mauritaniens à suivre leurs crédits clients simplement,
          sans cahier, sans calculs compliqués - pour toujours savoir qui leur doit quoi.
        </p>
      </header>

      {/* Le problème / la réponse */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-6 space-y-2">
          <h2 className="font-bold text-gray-900">Le problème</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dans beaucoup de boutiques, les ventes à crédit sont notées sur un cahier. Une page se déchire,
            un montant s&apos;oublie, et à la fin du mois il devient difficile de savoir qui a payé, qui doit
            encore, et combien. C&apos;est du temps perdu - et de l&apos;argent qui ne rentre pas.
          </p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50/60 p-6 space-y-2">
          <h2 className="font-bold text-gray-900">La réponse</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            ShopBook remplace ce cahier par une application claire et rapide. Vous enregistrez un crédit en
            quelques secondes, notez les paiements au fur et à mesure, et voyez en un coup d&apos;œil l&apos;état de
            chaque client. Tout est calculé pour vous.
          </p>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 text-center">Ce que vous pouvez faire</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Feature icon={Users} titre="Gérer vos clients" desc="Un carnet de contacts propre : nom, téléphone, et l'historique de ce que chacun vous doit." />
          <Feature icon={Package} titre="Suivre vos produits" desc="Votre catalogue avec les prix, le stock et les unités locales (sac, kilo, bidon…)." />
          <Feature icon={CreditCard} titre="Enregistrer crédits et paiements" desc="Notez un crédit, ajoutez les paiements progressifs : le montant restant et le statut se mettent à jour seuls." />
          <Feature icon={LayoutDashboard} titre="Tout voir d'un coup d'œil" desc="Un tableau de bord clair : l'argent à récupérer, ce qui a été encaissé, les clients qui doivent le plus." />
        </div>
      </section>

      {/* Valeurs */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 text-center">Pensé pour les commerçants</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Valeur icon={Smartphone} titre="Simple" desc="Conçu pour être pris en main sans formation, directement depuis le téléphone." />
          <Valeur icon={ShieldCheck} titre="Sûr" desc="Vos données sont protégées et vous appartiennent. Pas de publicité, rien n'est revendu." />
          <Valeur icon={HandCoins} titre="Sans engagement" desc="Aucun prélèvement automatique. Vous payez chaque mois si vous le décidez, par vos moyens habituels." />
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="rounded-2xl border bg-white p-6 md:p-8 space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Comment ça marche</h2>
        <ol className="space-y-4">
          <Etape n="1" titre="Créez votre compte" desc="Quelques informations sur vous et votre boutique, et c'est prêt. Vous démarrez avec 14 jours d'essai gratuit." />
          <Etape n="2" titre="Ajoutez vos clients et vos crédits" desc="Enregistrez qui vous doit quoi, au fur et à mesure de vos ventes à crédit." />
          <Etape n="3" titre="Notez les paiements" desc="À chaque remboursement, ajoutez le montant reçu. ShopBook calcule le reste et met à jour le statut." />
          <Etape n="4" titre="Gardez le contrôle" desc="Consultez votre tableau de bord à tout moment pour savoir où vous en êtes." />
        </ol>
      </section>

      {/* Origine / mission */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Notre mission</h2>
        <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed">
          ShopBook est né d&apos;un constat simple : les outils numériques ignorent souvent les réalités du
          commerce de quartier. Notre objectif est de proposer un outil pensé pour le contexte mauritanien -
          son vocabulaire, ses moyens de paiement, sa façon de faire du commerce - afin que chaque commerçant,
          même peu habitué aux applications, puisse gérer ses crédits avec confiance et tranquillité.
        </p>
      </section>

      {/* Appel à l'action */}
      <section className="rounded-2xl bg-vert-foncee text-white p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Prêt à ranger le cahier ?</h2>
        <p className="text-white/80 max-w-md mx-auto text-sm">
          Essayez ShopBook gratuitement pendant 14 jours. Sans carte bancaire, sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
          <Link href="/register" className="bg-white text-vert-foncee font-bold px-6 py-3 rounded-lg hover:opacity-90 transition text-center">
            Commencer gratuitement
          </Link>
          <Link href="/" className="border-2 border-white/40 font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition text-center">
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>

      {/* Contact léger */}
      <div className="pt-2 text-center text-sm text-muted-foreground">
        Une question ? Écrivez-nous à{" "}
        <a href="mailto:contact@shopbook.mr" className="font-semibold text-vert-foncee hover:underline">contact@shopbook.mr</a>
      </div>
    </article>
  );
}

/* --- composants de présentation --- */

function Feature({ icon: Icon, titre, desc }: { icon: React.ElementType; titre: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{titre}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

function Valeur({ icon: Icon, titre, desc }: { icon: React.ElementType; titre: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 text-center space-y-2">
      <div className="w-11 h-11 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center mx-auto">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-gray-900">{titre}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Etape({ n, titre, desc }: { n: string; titre: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-sm font-bold flex items-center justify-center shrink-0">
        {n}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{titre}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </li>
  );
}