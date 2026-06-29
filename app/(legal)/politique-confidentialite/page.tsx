import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité · ShopBook",
};

const DERNIERE_MAJ = "25 juin 2026";

export default function ConfidentialitePage() {
  return (
    <article>
      {/* En-tête */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : {DERNIERE_MAJ}</p>
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
          ShopBook est une application en ligne de gestion de crédits clients destinée aux commerçants. Cette
          politique explique quelles données nous collectons, pourquoi, comment elles sont protégées, et quels sont
          vos droits.
        </p>
      </div>

      <div className="space-y-8">
        <Section n="1" titre="Qui est responsable de vos données ?">
          <p>
            ShopBook est édité par son exploitant, basé à Nouakchott, Mauritanie. Une précision importante selon le
            type de données :
          </p>
          <Puces items={[
            "Pour les informations de votre compte (vous, le commerçant), ShopBook est responsable du traitement.",
            "Pour les informations que vous saisissez sur vos propres clients (noms, numéros, montants dus), c'est vous qui êtes responsable de ces données : vous devez vous assurer d'avoir le droit de les enregistrer et de les utiliser dans ce cadre. ShopBook agit alors comme prestataire technique : nous stockons et sécurisons ces données pour vous, sans les utiliser pour notre propre compte.",
          ]} />
        </Section>

        <Section n="2" titre="Quelles données nous collectons">
          <p className="font-semibold text-gray-800">Les informations de votre compte</p>
          <Puces items={[
            "Nom, numéro de téléphone, adresse e-mail (si fournie)",
            "Nom de votre boutique",
            "Mot de passe (jamais stocké en clair : il est chiffré avant d'être enregistré)",
          ]} />

          <p className="font-semibold text-gray-800">Les informations que vous saisissez dans l&apos;application</p>
          <Puces items={[
            "Vos clients (nom, téléphone)",
            "Vos produits (nom, prix, stock)",
            "Vos crédits et paiements (montants, dates, statuts)",
          ]} />

          <p className="font-semibold text-gray-800">Les preuves de paiement de votre abonnement</p>
          <Puces items={[
            "La capture d'écran que vous envoyez lors d'un paiement par Bankily, Masrvi ou Sedad, le temps nécessaire à sa vérification.",
          ]} />

          <p>Nous ne collectons pas plus que ce qui est nécessaire au fonctionnement de ShopBook.</p>
        </Section>

        <Section n="3" titre="Pourquoi nous utilisons ces données">
          <Puces items={[
            "Faire fonctionner l'application (afficher vos clients, vos crédits, votre tableau de bord)",
            "Gérer votre essai gratuit et votre abonnement",
            "Vérifier vos paiements d'abonnement",
            "Sécuriser votre compte et l'accès à vos données",
            "Vous répondre quand vous nous contactez",
            "Améliorer le service",
          ]} />
          <Encadre>
            Nous n&apos;utilisons pas vos données pour de la publicité, et nous ne les vendons à personne.
          </Encadre>
        </Section>

        <Section n="4" titre="Où sont stockées vos données">
          <p>
            Vos données sont stockées chez nos prestataires techniques d&apos;hébergement, qui peuvent se trouver sur des
            serveurs situés hors de Mauritanie. Ces prestataires sont choisis pour leur niveau de sécurité, et n&apos;ont
            pas le droit d&apos;utiliser vos données pour leur propre compte.
          </p>
        </Section>

        <Section n="5" titre="Sécurité">
          <Puces items={[
            "Les mots de passe sont chiffrés (jamais stockés en texte lisible).",
            "Les connexions à ShopBook sont sécurisées.",
            "L'accès à vos données est limité aux personnes qui en ont strictement besoin pour faire fonctionner le service ou vous assister.",
          ]} />
          <p>Aucun système n&apos;est garanti à 100 % invulnérable, mais nous prenons ces mesures au sérieux.</p>
        </Section>

        <Section n="6" titre="Combien de temps nous gardons vos données">
          <p>
            Vos données sont conservées tant que votre compte est actif. Si vous demandez la suppression de votre
            compte, vos données sont supprimées dans un délai raisonnable, sauf si la loi nous impose de conserver
            certaines informations plus longtemps (par exemple à des fins comptables).
          </p>
        </Section>

        <Section n="7" titre="Avec qui nous partageons vos données">
          <p>Nous ne partageons vos données qu&apos;avec :</p>
          <Puces items={[
            "Nos prestataires techniques (hébergement, infrastructure), uniquement pour faire fonctionner le service",
            "Les autorités compétentes, si la loi mauritanienne nous y oblige",
          ]} />
          <p>Nous ne partageons jamais vos données à des fins commerciales ou publicitaires.</p>
        </Section>

        <Section n="8" titre="Vos droits">
          <Puces items={[
            "Accéder aux données que nous détenons sur vous",
            "Demander leur correction si elles sont inexactes",
            "Demander leur suppression",
            "Vous opposer à certains usages de vos données",
            "Retirer votre consentement à tout moment",
          ]} />
        </Section>

        <Section n="9" titre="Contact">
          <p>Une question sur vos données ou cette politique ?</p>
          <Puces items={[
            "E-mail : contact@shopbook.mr",
            "WhatsApp : +222 42 09 80 02",
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

/* --- composants de présentation (identiques à la page Conditions) --- */

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