"use client";

import Image from "next/image";

/** Formate "41424344" → "41 42 43 44" (groupes de 2, visuel seulement) */
function formaterAffichage(chiffres: string): string {
  return chiffres.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

type Props = {
  name: string;            // nom du champ ENVOYÉ (valeur = +222XXXXXXXX)
  defaultValue?: string;   // ex: "+22241424344" (au rechargement après erreur)
  invalid?: boolean;
  id?: string;
};

export default function TelephoneInput({ name, defaultValue, invalid, id }: Props) {
  // On extrait les 8 chiffres nationaux d'une valeur stockée éventuelle
  const chiffresInitiaux = (defaultValue ?? "").replace(/^\+222/, "").replace(/\D/g, "").slice(0, 8);

  // Deux champs : un visible (formaté) + un caché (la vraie valeur +222…)
  return (
    <TelephoneInputInterne
      id={id}
      name={name}
      chiffresInitiaux={chiffresInitiaux}
      invalid={invalid}
    />
  );
}

import { useState } from "react";

function TelephoneInputInterne({
  id, name, chiffresInitiaux, invalid,
}: {
  id?: string; name: string; chiffresInitiaux: string; invalid?: boolean;
}) {
  const [chiffres, setChiffres] = useState(chiffresInitiaux);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // on ne garde que les chiffres, max 8
    const nets = e.target.value.replace(/\D/g, "").slice(0, 8);
    setChiffres(nets);
  };

  const valeurStockee = chiffres ? `+222${chiffres}` : "";

  return (
    <div className="relative">
      {/* Préfixe : drapeau + indicatif */}
      <div className="absolute left-0 top-0 h-full flex items-center gap-1.5 pl-3 pr-2 border-r pointer-events-none">
        <Image src="/images/Flag_of_Mauritania.svg" alt="Logo" width={30} height={30} className="object-contain rounded" />
        <span className="text-sm text-muted-foreground">+222</span>
      </div>

      {/* Champ visible : formaté avec espaces */}
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formaterAffichage(chiffres)}
        onChange={onChange}
        placeholder="41 42 43 44"
        aria-invalid={invalid}
        className={`w-full h-11 pl-[92px] pr-3 rounded-xl border bg-white text-sm outline-none transition focus:border-vert-foncee ${invalid ? "border-red-400" : ""}`}
      />

      {/* Champ réellement envoyé au serveur : +222XXXXXXXX, sans espaces */}
      <input type="hidden" name={name} value={valeurStockee} />
    </div>
  );
}