import Image from "next/image";
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
}