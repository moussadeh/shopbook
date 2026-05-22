/*import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function Welcome() {
    return (
        <section id="welcome" className="px-6 md:px-16 lg:px-24 xl:px-32 py-18 md:py-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-4xl font-bold leading-tight">
                        Gérez vos<br /><span className="text-primary">Crédits clients</span><br />en toute simplicité
                    </h1>

                    <p className="text-muted-foreground text-base leading-relaxed">
                        ShopBook est la plateforme de gestion de crédits clients conçue pour les commerçants Mauritaniens.
                    </p>

                    <ul className="text-muted-foreground space-y-2">
                        <li className="flex items-center gap-4"><CheckCircle size={20} className="text-orange" /> Enregistrez et suivez tous vos crédits clients.</li>
                        <li className="flex items-center gap-4"><CheckCircle size={20} className="text-orange" /> Consulter l historique et les paiements</li>
                        <li className="flex items-center gap-4"><CheckCircle size={20} className="text-orange" /> Sécurisez votre activité et développez votre commerce.</li>
                    </ul>

                    <div className="flex items-center gap-4 mt-6">
                        <button className="bg-primary font-bold text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
                            Commencer gratuitement
                        </button>
                        <button className="bg-white font-bold px-6 py-3 rounded-lg border-2 hover:opacity-90 transition border-vert-foncee text-vert-foncee">
                            Se connecter
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Image
                        src="/images/illustration2.png"
                        alt="Dashboard preview"
                        className="rounded-2xl border"
                        width={800}
                        height={500}
                    />
                </div>

            </div>
        </section>
    );
}*/

import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function Welcome() {
    return (
        <section id="welcome" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                <div className="space-y-5">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                        Gérez vos<br />
                        <span className="text-primary">Crédits clients</span><br />
                        en toute simplicité
                    </h1>

                    <p className="text-muted-foreground text-base leading-relaxed">
                        ShopBook est la plateforme de gestion de crédits clients conçue pour les commerçants Mauritaniens.
                    </p>

                    <ul className="text-muted-foreground space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-orange shrink-0 mt-0.5" />
                            <span>Enregistrez et suivez tous vos crédits clients.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-orange shrink-0 mt-0.5" />
                            <span>Consultez l&apos;historique et les paiements.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-orange shrink-0 mt-0.5" />
                            <span>Sécurisez votre activité et développez votre commerce.</span>
                        </li>
                    </ul>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        <button className="bg-primary font-bold text-white px-6 py-3 rounded-lg hover:opacity-90 transition text-sm">
                            Commencer gratuitement
                        </button>
                        <button className="bg-white font-bold px-6 py-3 rounded-lg border-2 hover:opacity-90 transition border-vert-foncee text-vert-foncee text-sm">
                            Se connecter
                        </button>
                    </div>
                </div>

                <div className="relative w-full mt-4 md:mt-0">
                    <div className="absolute inset-0 rounded-2xl"
                        style={{ background: "var(--light-jaune)", transform: "rotate(2deg)", zIndex: 0 }} />
                    <Image
                        src="/images/illustration2.png"
                        alt="Dashboard preview"
                        className="relative rounded-2xl border shadow-md w-full h-auto object-cover"
                        style={{ zIndex: 1 }}
                        width={800}
                        height={500}
                    />
                </div>

            </div>
        </section>
    );
}