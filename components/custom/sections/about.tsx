import { Store, ShoppingBag, Wrench, Truck, Smartphone, Users, Briefcase, AlertCircle, CheckCircle, X, Check } from "lucide-react";

export default function About() {
  const sectors = [
    { icon: <Store size={15} />, label: "Épiceries" },
    { icon: <ShoppingBag size={15} />, label: "Boutiques" },
    { icon: <Wrench size={15} />, label: "Quincailleries" },
    { icon: <Truck size={15} />, label: "Grossistes" },
    { icon: <Smartphone size={15} />, label: "Vendeurs en ligne" },
    { icon: <Users size={15} />, label: "Petites activités" },
    { icon: <Briefcase size={15} />, label: "Services" },
  ];

  return (
    <section id="about" className="px-6 md:px-12 py-8 bg-[#f8faf8]">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 text-md font-medium px-4 py-2 rounded-full bg-secondary text-vert-foncee">
            À propos de nous
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Conçu pour les commerçants<br /><span className="text-primary">mauritaniens</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            ShopBook remplace les carnets crédit par une plateforme simple et fiable - suivez vos dettes, enregistrez les paiements et gardez le contrôle de votre activité.
          </p>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Quel que soit votre secteur, ShopBook s adapte à votre commerce.
          </p>
        </div>

        {/* Secteurs */}
        <div className="flex flex-wrap justify-center gap-2 border-t border-b py-4">
          {sectors.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary border rounded-full px-4 py-1.5">
              <span style={{ color: "var(--green)" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Comparaison */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-muted p-6 space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-base">
              <AlertCircle size={20} className="text-destructive" /> Avant ShopBook
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Cahiers difficiles à suivre", "Informations perdues ou oubliées", "Calculs manuels et erreurs fréquentes", "Aucune vision claire des dettes"].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 shrink-0 mt-0.5">
                    <X size={11} className="text-destructive" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 space-y-4 text-white bg-primary">
            <h3 className="flex items-center gap-2 font-semibold text-base">
              <CheckCircle size={20} /> Avec ShopBook
            </h3>
            <ul className="space-y-3 text-sm text-white/85">
              {["Tous les crédits centralisés", "Suivi simple des paiements", "Calcul automatique des montants", "Vision claire de votre activité"].map(item => (
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

      </div>
    </section>
  );
}

/*import { Store, ShoppingBag, Wrench, Truck, AlertCircle, CheckCircle, Smartphone, Users, Toolbox, Check, X } from "lucide-react";

export default function About() {
    return (
        <section id="about" className="px-6 md:px-12 py-6 bg-secondary">
            <div className="max-w-6xl mx-auto space-y-12">

                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-vert-foncee">À propos de nous</h2>
                    <p className="text-lg text-muted-foreground">
                        ShopBook est une plateforme conçu pour les commerçants mauritaniens pour les aider à gérer leurs crédits clients de manière simple et efficace. Elle vous offre les outils nécessaires pour suivre vos dettes, enregistrer les paiements et garder le contrôle de votre activité.
                    </p>
                    
                    <p className="text-lg text-muted-foreground">
                        Quelque soit votre secteur d activité, ShopBook est là pour vous aider à gérer vos crédits clients et à faire prospérer votre commerce.
                    </p>
                    <div className="flex flex-wrap py-3 justify-center gap-6 text-sm text-muted-foreground border-t border-b">
                        <div className="flex items-center gap-2">
                            <Store size={18} />
                            <span>Épiceries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} />
                            <span>Boutiques</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wrench size={18} />
                            <span>Quincailleries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck size={18} />
                            <span>Grossistes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone size={18} />
                            <span>Vendeurs en ligne (TikTok, WhatsApp)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <span>Petites activités</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Toolbox size={18} />
                            <span>Services</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    <div className="border rounded-xl p-6 space-y-4 bg-muted">
                        <h3 className="text-xl font-bold flex gap-2 items-center"><AlertCircle className="text-destructive" size={25} /> Avant</h3>

                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-3"><X className="text-destructive" size={20} /> Cahiers difficiles à suivre</li>
                            <li className="flex items-center gap-3"><X className="text-destructive" size={20} /> Informations perdues ou oubliées</li>
                            <li className="flex items-center gap-3"><X className="text-destructive" size={20} /> Calculs manuels et erreurs fréquentes</li>
                            <li className="flex items-center gap-3"><X className="text-destructive" size={20} /> Aucune vision claire des dettes</li>
                        </ul>
                    </div>

                    <div className="border rounded-xl p-6 space-y-4 bg-primary text-white">
                        <h3 className="text-xl flex gap-2 items-center font-bold"><CheckCircle size={25} /> Avec ShopBook</h3>

                        <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-3"><Check size={20} /> Tous les crédits centralisés</li>
                            <li className="flex items-center gap-3"><Check size={20} /> Suivi simple des paiements</li>
                            <li className="flex items-center gap-3"><Check size={20} /> Calcul automatique des montants</li>
                            <li className="flex items-center gap-3"><Check size={20} /> Vision claire de votre activité</li>
                        </ul>
                    </div>

                </div>

            </div>
        </section>
    );
}*/