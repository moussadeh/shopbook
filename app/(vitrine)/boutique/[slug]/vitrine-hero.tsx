import { BadgeCheck, ShieldCheck, HandCoins, Sparkles } from "lucide-react";
import type { Vitrine } from "@/lib/data/boutique-publique";
import Image from "next/image";

const IMAGE_VITRINE = "/images/boutique3.png";

export default function VitrineHero({ vitrine }: { vitrine: Vitrine }) {
  return (
    <header className="max-w-6xl mx-auto px-4 md:px-6 pt-5">
      <div className="rounded-3xl bg-vert-claire-2 text-black overflow-hidden flex flex-col md:flex-row">
        {/* Texte */}
        <div className="flex-1 p-4 md:p-6 space-y-3 order-2 md:order-1">
          {/* <Image src="/logos/logo/ShopBook.png" alt="Logo" width={40} height={40} className="object-contain rounded" /> */}

          <div>
            <h1 className="text-vert-foncee text-2xl md:text-3xl font-bold flex items-center gap-2">
              {vitrine.nom}
              <BadgeCheck size={22} className="text-vert-foncee" />
            </h1>
            <p className="text-black mt-2 leading-relaxed max-w-sm">
              Passez vos commandes en quelques clics et payez à la réception. Simple et sans souci.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Reassurance icon={<Sparkles size={14} />} label="Produits de qualité" />
            <Reassurance icon={<HandCoins size={14} />} label="Prix justes" />
            <Reassurance icon={<ShieldCheck size={14} />} label="Service fiable" />
          </div>
        </div>

        {/* Image partagée — optimisée via next/image */}
        <div className="relative w-full h-52 sm:h-64 md:h-auto md:w-2/5 md:min-h-[200px] order-1 md:order-2">
          <Image
            src={IMAGE_VITRINE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}

function Reassurance({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="text-black inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 rounded-full px-3 py-1.5">
      <span className="text-vert-foncee">{icon}</span>
      {label}
    </span>
  );
}