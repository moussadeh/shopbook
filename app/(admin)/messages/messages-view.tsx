"use client";

import { useState } from "react";
import { Mail, Search, Reply, Check, Circle, ArrowLeft } from "lucide-react";
import type { MessageRow } from "@/lib/data/admin";
import { marquerLu } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagesView({ messages }: { messages: MessageRow[] }) {
  const [search, setSearch] = useState("");
  const [actif, setActif] = useState<MessageRow | null>(null);

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sujet.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const nbNonLus = messages.filter((m) => !m.lu).length;

  const ouvrir = (m: MessageRow) => {
    setActif(m);
    if (!m.lu) marquerLu(m.id, true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Messages de contact</h1>
        <p className="text-sm text-muted-foreground">
          {nbNonLus > 0 ? `${nbNonLus} non lu${nbNonLus > 1 ? "s" : ""}` : "Tout est lu"}
        </p>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        {/* Liste — cachée sur mobile quand un message est ouvert */}
        <div className={`bg-white rounded-2xl border overflow-hidden flex-col ${actif ? "hidden lg:flex" : "flex"}`}>
          <div className="p-3 border-b">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          <div className="divide-y overflow-y-auto max-h-[65vh]">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => ouvrir(m)}
                className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50/60 transition ${
                  actif?.id === m.id ? "bg-green-50/50" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${m.lu ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                      {m.name}
                    </p>
                    {!m.lu && <Circle size={8} className="fill-vert-foncee text-vert-foncee shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{m.sujet}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.date}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">Aucun message</div>
            )}
          </div>
        </div>

        {/* Détail — caché sur mobile tant qu'aucun message n'est ouvert */}
        <div className={`bg-white rounded-2xl border p-5 md:p-6 ${actif ? "block" : "hidden lg:block"}`}>
          {actif ? (
            <div className="space-y-5">
              {/* Retour (mobile uniquement) */}
              <button
                onClick={() => setActif(null)}
                className="lg:hidden inline-flex items-center gap-1.5 text-sm font-medium text-vert-foncee"
              >
                <ArrowLeft size={16} /> Retour
              </button>

              <div className="flex items-start justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-vert-foncee text-white font-bold flex items-center justify-center shrink-0">
                    {actif.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{actif.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{actif.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{actif.date}</span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Sujet</p>
                <p className="font-semibold text-gray-900">{actif.sujet}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{actif.message}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t items-center">
                <a
                  href={`mailto:${actif.email}?subject=RE: ${encodeURIComponent(actif.sujet)}`}
                  className="inline-flex items-center gap-2 bg-vert-foncee text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition"
                >
                  <Reply size={15} /> Répondre par email
                </a>
                <Button variant="outline" onClick={() => marquerLu(actif.id, !actif.lu)} className="gap-2">
                  <Check size={15} /> Marquer {actif.lu ? "non lu" : "lu"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
              <Mail size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}