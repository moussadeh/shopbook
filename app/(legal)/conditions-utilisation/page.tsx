import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation · ShopBook",
};

const DERNIERE_MAJ = "25 juin 2026";

export default function ConditionsPage() {
  return (
    <article>
      {/* En-tête */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : {DERNIERE_MAJ}</p>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
          Bienvenue sur ShopBook. En créant un compte ou en utilisant le service, vous acceptez les présentes
          conditions. Merci de les lire attentivement.
        </p>
      </div>

      <div className="space-y-8">
        <Section n="1" titre="Présentation du service">
          <p>
            ShopBook est une application en ligne accessible depuis un navigateur (téléphone ou ordinateur), sans
            installation, qui permet à un commerçant de :
          </p>
          <Puces items={[
            "Gérer ses clients et ses produits",
            "Enregistrer les crédits accordés et les paiements reçus",
            "Suivre, à tout moment, qui lui doit quoi",
          ]} />
        </Section>

        <Section n="2" titre="Création de compte">
          <p>
            Pour utiliser ShopBook, vous devez créer un compte avec des informations exactes (nom, numéro de
            téléphone, nom de votre boutique). Vous devez être majeur pour créer un compte.
          </p>
          <p>
            Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité réalisée depuis
            votre compte. Si vous pensez que votre compte a été utilisé sans votre autorisation, contactez-nous
            immédiatement.
          </p>
        </Section>

        <Section n="3" titre="Essai gratuit">
          <p>
            À l&apos;inscription, vous bénéficiez d&apos;un essai gratuit de 14 jours, donnant accès à l&apos;ensemble des
            fonctionnalités de ShopBook, sans paiement et sans engagement.
          </p>
          <p>
            À la fin des 14 jours, si vous n&apos;avez pas souscrit d&apos;abonnement, l&apos;accès à votre espace est restreint
            jusqu&apos;à ce que vous régliez un abonnement. Vos données restent conservées.
          </p>
        </Section>

        <Section n="4" titre="Abonnement et paiement">
          <p>
            ShopBook fonctionne par abonnement payant après l&apos;essai gratuit. Les tarifs en vigueur sont affichés sur
            notre page Tarifs.
          </p>
          <p className="font-semibold text-gray-800">Comment fonctionne le paiement :</p>
          <Puces items={[
            "Le paiement se fait par vos propres moyens, via Bankily, Masrvi ou Sedad.",
            "Vous soumettez ensuite la preuve de ce paiement (capture d&apos;écran) dans votre espace ShopBook.",
            "Votre accès est rétabli immédiatement, dès la soumission de votre preuve.",
            "Un administrateur vérifie ensuite la réception du paiement, en général sous 48 h.",
            "Si le paiement n'est pas confirmé, votre accès est de nouveau bloqué, et vous devrez recommencer la démarche avec une preuve valide.",
          ]} />
          <Encadre>
            <strong>Important :</strong> ShopBook ne prélève aucun paiement automatiquement. Aucune carte bancaire ni
            moyen de paiement n&apos;est enregistré chez nous. C&apos;est vous qui décidez, chaque mois, de renouveler ou non
            votre abonnement.
          </Encadre>
        </Section>

        <Section n="5" titre="Vos données et celles de vos clients">
          <p>
            Les informations que vous enregistrez dans ShopBook (vos clients, vos produits, vos crédits) vous
            appartiennent. Vous êtes seul responsable de :
          </p>
          <Puces items={[
            "L'exactitude des informations que vous saisissez",
            "Le respect du droit applicable concernant les données personnelles de vos propres clients que vous enregistrez dans l'application",
          ]} />
          <p>
            ShopBook agit comme prestataire technique pour le stockage et la sécurisation de ces données (voir notre
            Politique de confidentialité).
          </p>
        </Section>

        <Section n="6" titre="Ce que ShopBook permet — et ce qu'il ne fait pas">
          <p>
            ShopBook est un outil de gestion et de suivi. Il vous aide à organiser et suivre vos crédits clients,
            mais :
          </p>
          <Puces items={[
            "ShopBook ne garantit pas que vos clients vous remboursent : le service est un outil de suivi, pas un service de recouvrement ni un établissement financier.",
            "ShopBook n'intervient pas dans les litiges commerciaux entre vous et vos clients.",
            "ShopBook n'effectue ni ne traite aucun paiement entre vous et vos clients, ni entre vous et nous.",
          ]} />
        </Section>

        <Section n="7" titre="Usage autorisé">
          <p>Vous vous engagez à utiliser ShopBook de façon légale et de bonne foi. Sont notamment interdits :</p>
          <Puces items={[
            "L'utilisation du service à des fins frauduleuses, y compris la soumission de fausses preuves de paiement",
            "Toute tentative de contourner la sécurité du service",
            "Toute utilisation portant atteinte aux droits d'un tiers",
          ]} />
          <p>Le non-respect de ces règles peut entraîner la suspension ou la fermeture de votre compte.</p>
        </Section>

        <Section n="8" titre="Disponibilité du service">
          <p>
            Nous faisons notre possible pour que ShopBook soit accessible en permanence, mais des interruptions
            ponctuelles peuvent survenir (maintenance, mise à jour, incident technique). Nous ne garantissons pas une
            disponibilité ininterrompue.
          </p>
        </Section>

        <Section n="9" titre="Propriété intellectuelle">
          <p>
            Le nom ShopBook, son logo, son design et son code restent la propriété de leur titulaire. Vous n&apos;êtes
            autorisé à utiliser le service que pour la gestion de votre propre activité commerciale.
          </p>
        </Section>

        <Section n="10" titre="Résiliation">
          <p>
            Vous pouvez arrêter d&apos;utiliser ShopBook à tout moment : il vous suffit de ne pas renouveler votre
            abonnement, aucune démarche d&apos;annulation n&apos;est nécessaire puisqu&apos;aucun paiement automatique n&apos;est mis en
            place.
          </p>
          <p>
            Nous pouvons suspendre ou fermer un compte en cas de non-paiement prolongé, de fraude, ou de non-respect
            des présentes conditions.
          </p>
        </Section>

        <Section n="11" titre="Modifications">
          <p>
            Nous pouvons faire évoluer ShopBook ainsi que les présentes conditions. En cas de changement important,
            nous vous en informerons.
          </p>
        </Section>

        <Section n="12" titre="Droit applicable">
          <p>
            Les présentes conditions sont soumises au droit mauritanien. Tout litige relève des juridictions
            compétentes de Nouakchott.
          </p>
        </Section>

        <Section n="13" titre="Contact">
          <p>Une question sur ces conditions ?</p>
          <Puces items={[
            "E-mail : contact@shopbook.mr",
            "WhatsApp : +222 00 00 00 00",
            "Adresse : Nouakchott, Mauritanie",
          ]} />
        </Section>
      </div>

      {/* Pied de page léger */}
      <div className="mt-12 pt-6 border-t text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} ShopBook</p>
        <Link href="/" className="font-semibold text-vert-foncee hover:underline">Retour à l&apos;accueil</Link>
      </div>
    </article>
  );
}

/* --- petits composants de présentation --- */

function Section({ n, titre, children }: { n: string; titre: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-20">
      <h2 className="text-lg font-bold text-gray-900 mb-3">
        <span className="text-vert-foncee">{n}.</span> {titre}
      </h2>
      <div className="space-y-3 text-sm md:text-[15px] text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

function Puces({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-vert-foncee shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Encadre({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50/60 p-4 text-sm text-gray-700 leading-relaxed">
      {children}
    </div>
  );
}