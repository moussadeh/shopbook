import Link from "next/link";
import {
  Store, ShoppingBag, Wrench, Truck, Smartphone, Users, Briefcase,
  AlertCircle, CheckCircle, X, Check, Info, ArrowRight,
} from "lucide-react";

export default function About() {
  const sectors = [
    { icon: <Store size={15} />, label: "Épiceries" },
    { icon: <ShoppingBag size={15} />, label: "Boutiques" },
    { icon: <Wrench size={15} />, label: "Quincailleries" },
    { icon: <Truck size={15} />, label: "Grossistes" },
    { icon: <Smartphone size={15} />, label: "Vendeurs en ligne" },
    { icon: <Users size={15} />, label: "Petites activités" },
    { icon: <Briefcase size={15} />, label: "Autres services" },
  ];

  const etapes = [
    { n: "1", titre: "Créez votre compte", desc: "Quelques infos sur votre boutique, et c'est prêt. 14 jours d'essai gratuit." },
    { n: "2", titre: "Ajoutez vos crédits", desc: "Notez qui vous doit quoi, au fur et à mesure de vos ventes." },
    { n: "3", titre: "Notez les paiements", desc: "À chaque remboursement, le reste et le statut se mettent à jour seuls." },
    { n: "4", titre: "Gardez le contrôle", desc: "Consultez votre tableau de bord à tout moment." },
  ];

  return (
    <section id="about" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-10 bg-[#f8faf8]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-3 md:text-center">
          <span className="inline-flex items-center gap-2 text-md font-medium px-3 py-1.5 rounded-full bg-secondary text-vert-foncee">
            <Info size={18} /> À propos de nous
          </span>
          <h2 className="text-xl md:text-4xl font-bold leading-tight">
            Conçu pour les commerçants<br /><span className="text-primary">mauritaniens</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed md:max-w-xl md:mx-auto">
            ShopBook remplace les carnets crédit par une plateforme simple et fiable — suivez vos dettes, enregistrez les paiements et gardez le contrôle de votre activité.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed md:max-w-xl md:mx-auto">
            Quel que soit votre secteur, ShopBook s&apos;adapte à votre commerce.
          </p>
        </div>

        {/* Secteurs */}
        <div className="flex flex-wrap gap-2 md:justify-center border-t border-b py-4">
          {sectors.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary border rounded-full px-4 py-1.5">
              <span style={{ color: "var(--green)" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Comparaison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-muted p-5 md:p-6 space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-base">
              <AlertCircle size={20} className="text-destructive shrink-0" /> Avant ShopBook
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Cahiers difficiles à suivre", "Informations perdues ou oubliées", "Calculs à la main, erreurs fréquentes", "Pas de vue claire sur qui vous doit quoi"].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 shrink-0 mt-0.5">
                    <X size={11} className="text-destructive" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-5 md:p-6 space-y-4 text-white bg-primary">
            <h3 className="flex items-center gap-2 font-semibold text-base">
              <CheckCircle size={20} className="shrink-0" /> Avec ShopBook
            </h3>
            <ul className="space-y-3 text-sm text-white/85">
              {["Tous vos crédits au même endroit", "Suivi simple des paiements", "Calcul automatique des montants", "Vue claire sur votre commerce"].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 shrink-0 mt-0.5">
                    <Check size={11} className="text-green-200" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comment ça marche — 4 étapes */}
        <div className="space-y-5 pt-2">
          <h3 className="text-lg md:text-xl font-bold md:text-center text-vert-foncee">Comment ça marche</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {etapes.map(({ n, titre, desc }) => (
              <div key={n} className="rounded-2xl border bg-white p-5 space-y-2">
                <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-sm font-bold flex items-center justify-center">
                  {n}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{titre}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* En savoir plus → page À propos complète */}
        <div className="md:text-center pt-2">
          <Link
            href="/a-propos"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-vert-foncee hover:gap-3 transition-all"
          >
            En savoir plus sur ShopBook <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}


// import { Store, ShoppingBag, Wrench, Truck, Smartphone, Users, Briefcase, AlertCircle, CheckCircle, X, Check, Info } from "lucide-react";

// export default function About() {
//   const sectors = [
//     { icon: <Store size={15} />, label: "Épiceries" },
//     { icon: <ShoppingBag size={15} />, label: "Boutiques" },
//     { icon: <Wrench size={15} />, label: "Quincailleries" },
//     { icon: <Truck size={15} />, label: "Grossistes" },
//     { icon: <Smartphone size={15} />, label: "Vendeurs en ligne" },
//     { icon: <Users size={15} />, label: "Petites activités" },
//     { icon: <Briefcase size={15} />, label: "Autres services" },
//   ];

//   return (
//     <section id="about" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-10 bg-[#f8faf8]">
//       <div className="max-w-4xl mx-auto space-y-8">

//         {/* Header */}
//         <div className="space-y-3 md:text-center">
//           <span className="inline-flex items-center gap-2 text-md font-medium px-3 py-1.5 rounded-full bg-secondary text-vert-foncee">
//             <Info size={18} /> À propos de nous
//           </span>
//           <h2 className="text-xl md:text-4xl font-bold leading-tight">
//             Conçu pour les commerçants<br /><span className="text-primary">mauritaniens</span>
//           </h2>
//           <p className="text-muted-foreground text-base leading-relaxed md:max-w-xl md:mx-auto">
//             ShopBook remplace les carnets crédit par une plateforme simple et fiable — suivez vos dettes, enregistrez les paiements et gardez le contrôle de votre activité.
//           </p>
//           <p className="text-muted-foreground text-base leading-relaxed md:max-w-xl md:mx-auto">
//             Quel que soit votre secteur, ShopBook s&apos;adapte à votre commerce.
//           </p>
//         </div>

//         {/* Secteurs */}
//         <div className="flex flex-wrap gap-2 md:justify-center border-t border-b py-4">
//           {sectors.map(({ icon, label }) => (
//             <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary border rounded-full px-4 py-1.5">
//               <span style={{ color: "var(--green)" }}>{icon}</span>
//               {label}
//             </div>
//           ))}
//         </div>

//         {/* Comparaison */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="rounded-2xl border bg-muted p-5 md:p-6 space-y-4">
//             <h3 className="flex items-center gap-2 font-semibold text-base">
//               <AlertCircle size={20} className="text-destructive shrink-0" /> Avant ShopBook
//             </h3>
//             <ul className="space-y-3 text-sm text-muted-foreground">
//               {["Cahiers difficiles à suivre", "Informations perdues ou oubliées", "Calculs à la main, erreurs fréquentes", "Pas de vue claire sur qui vous doit quoi"].map(item => (
//                 <li key={item} className="flex items-start gap-3">
//                   <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 shrink-0 mt-0.5">
//                     <X size={11} className="text-destructive" />
//                   </span>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-2xl p-5 md:p-6 space-y-4 text-white bg-primary">
//             <h3 className="flex items-center gap-2 font-semibold text-base">
//               <CheckCircle size={20} className="shrink-0" /> Avec ShopBook
//             </h3>
//             <ul className="space-y-3 text-sm text-white/85">
//               {["Tous vos crédits au même endroit", "Suivi simple des paiements", "Calcul automatique des montants", "Vue claire sur votre commerce"].map(item => (
//                 <li key={item} className="flex items-start gap-3">
//                   <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 shrink-0 mt-0.5">
//                     <Check size={11} className="text-green-200" />
//                   </span>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }