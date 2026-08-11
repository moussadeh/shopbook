import { Building2, MapPin, Phone } from "lucide-react";
import type { Vitrine } from "@/lib/data/boutique-publique";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const IMAGE_VITRINE = "/images/boutique4.png";

export default function VitrineHero({ vitrine }: { vitrine: Vitrine }) {
  const telAffiche = vitrine.telephone.replace(/^\+222/, "").replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  return (
    <header className="max-w-6xl mx-auto px-4 md:px-6 pt-5">
      <div className="rounded-3xl bg-vert-claire-2 text-black overflow-hidden flex flex-col md:flex-row">
        {/* Texte */}
        <div className="flex-1 p-4 md:p-6 space-y-3 order-2 md:order-1">
          {/* <Image src="/logos/logo/ShopBook.png" alt="Logo" width={40} height={40} className="object-contain rounded" /> */}

          <div>
            <h1 className="text-vert-foncee text-2xl md:text-3xl font-bold flex items-center gap-2">
              {vitrine.nom}
            </h1>
            <p className="text-black mt-2 leading-relaxed max-w-sm">
              Passez vos commandes en quelques clics et payez à la réception. Simple et sans souci.
            </p>
          </div>

          {/* Badges d'infos */}
          <div className="flex flex-wrap gap-2 pt-1">
            {vitrine.telephone && (
              <Badge variant="outline" className="gap-1.5 bg-white/70 text-gray-700 hover:bg-white transition font-medium p-3">
                <Phone size={12} className="text-vert-foncee" /> {telAffiche}
              </Badge>
            )}
            {vitrine.ville && (
              <Badge variant="outline" className="gap-1.5 bg-white/70 text-gray-700 font-medium p-3">
                <Building2 size={12} className="text-vert-foncee" /> {vitrine.ville}
              </Badge>
            )}
            {vitrine.quartier && (
              <Badge variant="outline" className="gap-1.5 bg-white/70 text-gray-700 font-medium p-3">
                <MapPin size={12} className="text-vert-foncee" /> {vitrine.quartier}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative w-full h-52 sm:h-64 md:h-auto md:w-2/5 md:min-h-[200px] order-1 md:order-2">
          <Image
            src={IMAGE_VITRINE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            quality={85}
            priority
          />
        </div>
      </div>
    </header>
  );
}
