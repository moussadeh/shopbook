"use client";

import { useActionState, useEffect, useRef } from "react";
import { Mail, MapPin, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { envoyerMessageContact, type ContactState } from "@/app/(public)/actions";

const initial: ContactState = {};

export default function Contact() {
  const [state, formAction, isPending] = useActionState(envoyerMessageContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const err = state.fieldErrors ?? {};

  // vide le formulaire après un envoi réussi
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <section id="contact" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-10 bg-[#f8faf8]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Partie gauche */}
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-md font-medium px-3 py-1.5 rounded-full bg-secondary text-vert-foncee">
                <Mail size={18} /> Contact
              </span>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                Une question ?<br />
                <span className="text-primary">Écrivez-nous</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Notre équipe est disponible pour répondre à toutes vos questions sur ShopBook.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
                  <Mail size={18} style={{ color: "var(--green)" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">contact@shopbook.mr</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
                  <MessageCircle size={18} style={{ color: "var(--green)" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">+222 00 00 00 00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
                  <MapPin size={18} style={{ color: "var(--green)" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Adresse</p>
                  <p className="text-muted-foreground text-sm">Nouakchott, Mauritanie</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-5">
            {state.success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4 !text-green-600" />
                <AlertDescription>
                  Votre message a bien été envoyé. Nous vous répondrons bientôt.
                </AlertDescription>
              </Alert>
            )}
            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <form ref={formRef} action={formAction} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" name="prenom" placeholder="Ahmed" defaultValue={state.values?.prenom ?? ""} aria-invalid={!!err.prenom} />
                  {err.prenom && <p className="text-xs text-red-600">{err.prenom}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" name="nom" placeholder="Ould Mohamed" defaultValue={state.values?.nom ?? ""} aria-invalid={!!err.nom} />
                  {err.nom && <p className="text-xs text-red-600">{err.nom}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ahmed@example.com" defaultValue={state.values?.email ?? ""} aria-invalid={!!err.email} />
                {err.email && <p className="text-xs text-red-600">{err.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sujet">Sujet</Label>
                <Input id="sujet" name="sujet" placeholder="Comment puis-je vous aider ?" defaultValue={state.values?.sujet ?? ""} aria-invalid={!!err.sujet} />
                {err.sujet && <p className="text-xs text-red-600">{err.sujet}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Décrivez votre demande..." className="resize-none min-h-32.5" defaultValue={state.values?.message ?? ""} aria-invalid={!!err.message} />
                {err.message && <p className="text-xs text-red-600">{err.message}</p>}
              </div>

              <Button type="submit" disabled={isPending} className="cursor-pointer w-full font-semibold">
                {isPending ? "Envoi..." : "Envoyer le message"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

// import { Mail, MapPin, MessageCircle } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function Contact() {
//     return (
//         <section id="contact" className="px-4 md:px-16 lg:px-24 xl:px-32 py-6 md:py-10 bg-[#f8faf8]">
//             <div className="max-w-6xl mx-auto">

//                 <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

//                     {/* Partie gauche */}
//                     <div className="space-y-6">
//                         <div className="space-y-3">
//                             <span className="inline-flex items-center gap-2 text-md font-medium px-3 py-1.5 rounded-full bg-secondary text-vert-foncee">
//                                 <Mail size={18} /> Contact
//                             </span>
//                             <h2 className="text-2xl md:text-4xl font-bold leading-tight">
//                                 Une question ?<br />
//                                 <span className="text-primary">Écrivez-nous</span>
//                             </h2>
//                             <p className="text-muted-foreground text-base leading-relaxed">
//                                 Notre équipe est disponible pour répondre à toutes vos questions sur ShopBook.
//                             </p>
//                         </div>

//                         <div className="space-y-4 pt-2">
//                             <div className="flex items-start gap-4">
//                                 <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
//                                     <Mail size={18} style={{ color: "var(--green)" }} />
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-sm">Email</p>
//                                     <p className="text-muted-foreground text-sm">contact@shopbook.mr</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start gap-4">
//                                 <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
//                                     <MessageCircle size={18} style={{ color: "var(--green)" }} />
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-sm">WhatsApp</p>
//                                     <p className="text-muted-foreground text-sm">+222 00 00 00 00</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start gap-4">
//                                 <div className="p-2.5 rounded-xl shrink-0" style={{ background: "var(--light-jaune)" }}>
//                                     <MapPin size={18} style={{ color: "var(--green)" }} />
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-sm">Adresse</p>
//                                     <p className="text-muted-foreground text-sm">Nouakchott, Mauritanie</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Formulaire */}
//                     <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-5">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-1.5">
//                                 <Label htmlFor="prenom">Prénom</Label>
//                                 <Input id="prenom" placeholder="Ahmed" />
//                             </div>
//                             <div className="space-y-1.5">
//                                 <Label htmlFor="nom">Nom</Label>
//                                 <Input id="nom" placeholder="Ould Mohamed" />
//                             </div>
//                         </div>

//                         <div className="space-y-1.5">
//                             <Label htmlFor="email">Email</Label>
//                             <Input id="email" type="email" placeholder="ahmed@example.com" />
//                         </div>

//                         <div className="space-y-1.5">
//                             <Label htmlFor="sujet">Sujet</Label>
//                             <Input id="sujet" placeholder="Comment puis-je vous aider ?" />
//                         </div>

//                         <div className="space-y-1.5">
//                             <Label htmlFor="message">Message</Label>
//                             <Textarea
//                                 id="message"
//                                 placeholder="Décrivez votre demande..."
//                                 className="resize-none min-h-32.5"
//                             />
//                         </div>

//                         <Button className="cursor-pointer w-full font-semibold">
//                             Envoyer le message
//                         </Button>
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// }