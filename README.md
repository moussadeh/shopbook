# ShopBook

Application SaaS pour les commerçants de Mauritanie. Elle réunit deux métiers dans un seul outil :

1. **Le carnet de crédit** — remplacer le cahier papier où le commerçant note ce que ses clients lui doivent (emprunteurs, crédits, paiements échelonnés).
2. **La boutique en ligne** — une vitrine publique par commerçant (`/boutique/[slug]`) où les clients parcourent les produits, commandent en livraison ou en retrait, et suivent leurs commandes.

L'accès au tableau de bord est monétisé par un abonnement mensuel payé par mobile money (Bankily, Masrvi, Sedad) et validé manuellement par un administrateur.

Toute la base de code est en **français** : modèles Prisma, noms de fichiers, routes, fonctions, commentaires.

---

## Stack

| Domaine | Choix |
|---|---|
| Framework | Next.js **16.2.3** (App Router, Server Components, Server Actions) |
| UI | React 19.2, Tailwind CSS 4, shadcn/ui + Radix, lucide-react |
| Base de données | PostgreSQL (Supabase) via Prisma **7** + `@prisma/adapter-pg` |
| Authentification | Formulaire (telephone & mot de passe)
| Stockage fichiers | Supabase Storage
| Validation | Zod 4 |
| Langage | TypeScript strict |

> ⚠️ Next.js 16 comporte des ruptures d'API par rapport aux versions précédentes. Avant d'écrire du code, consulter le guide concerné dans `node_modules/next/dist/docs/` (cf. `AGENTS.md`).

---

## Démarrage

```bash
npm install
npx prisma migrate dev     # applique les migrations + génère le client
npm run dev                # http://localhost:3000
```

Le client Prisma est généré dans `app/generated/prisma/`. Après toute modification de `prisma/schema.prisma`, relancer `npx prisma generate`.

### Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | `prisma generate` puis `next build` |
| `npm start` | Serveur de production |
| `npm run lint` | ESLint |

### Variables d'environnement

À placer dans `.env` (non commité) :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion Postgres (pooler). Lue par `prisma.config.ts`, **pas** par `schema.prisma` |
| `DIRECT_URL` | Connexion directe, pour les migrations |
| `SESSION_SECRET` | Clé de signature HS256 des JWT de session — obligatoire |
| `NEXT_PUBLIC_SUPABASE_URL` | Projet Supabase (aussi utilisée côté serveur pour le storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service pour l'upload et les URL signées — **jamais côté client** |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app (liens de partage de vitrine) |

---

## Architecture

### Groupes de routes

Chaque groupe correspond à un espace et à son propre `layout.tsx` (donc à sa propre garde d'accès).

```
app/
├── (public)/        Landing page (accueil, à-propos, tarifs, contact)
├── (auth)/          login, register, mot-de-passe-oublié
├── (legal)/         CGU, politique de confidentialité, à propos
├── (account)/       abonnement — paiement et suivi du statut
├── (dashboard)/     ESPACE COMMERÇANT : dashboard, ma-boutique,
│                    produits, commandes, crédits, emprunteurs
├── (vitrine)/       ESPACE CLIENT : boutique/[slug], mes-boutiques,
│                    mes-commandes
├── (admin)/         ESPACE ADMIN : abonnements, messages
└── generated/prisma/  Client Prisma généré (commité)
```

### Découpage d'une page

Le motif est répété partout dans le dashboard — le suivre pour toute nouvelle section :

```
produits/
├── page.tsx                  Server Component : charge les données, vérifie l'accès
├── actions.ts                Server Actions ("use server") : create / update / delete
├── produits-view.tsx         Client Component : état, filtres, recherche, pagination
├── produits-table.tsx        Rendu desktop
├── produits-cards.tsx        Rendu mobile
├── produit-form-dialog.tsx   Formulaire de création / édition
└── produit-detail-dialog.tsx Détail en modale
```

### `lib/data` vs `lib/donnes` — distinction importante

Les deux dossiers ont des noms proches mais des rôles opposés :

- **[`lib/data/`](lib/data/)** — accès base de données, `import "server-only"` en tête. Chaque fonction commence par une garde (`exigerCommercant()`, `exigerAdmin()`…) qui fournit l'`id` servant à filtrer la requête. **C'est là que se joue l'isolation des données entre commerçants.**
- **[`lib/donnes/`](lib/donnes/)** — helpers de présentation importables côté client : libellés d'enums (`statutLabel`), classes de badges (`statutStyle`), `formatMRU`, construction des cartes de statistiques.

Autrement dit : `data` = lecture serveur, `donnes` = affichage.

### Autres dossiers

| Chemin | Contenu |
|---|---|
| [`lib/auth/`](lib/auth/) | Sessions, hachage, gardes de rôle, contrôle d'abonnement |
| [`lib/services/`](lib/services/) | Supabase Storage, envoi de SMS |
| [`lib/validations/`](lib/validations/) | Schémas Zod (auth, contact) |
| [`components/ui/`](components/ui/) | Primitives shadcn — ne pas modifier à la main |
| [`components/custom/`](components/custom/) | Composants applicatifs (navbar, sidebar, sections, widgets dashboard) |

---

## Modèle de données

```
Utilisateur ──┬── Commercant ──┬── Boutique ── Produit ── ImageProduit
              │                ├── Emprunteur ── Credit ── Paiement
              │                └── PaiementAbonnement
              └── Client ────────── Commande ── LigneCommande
```

**Un seul modèle `Utilisateur`**, identifié par son **téléphone** (unique — il n'y a pas d'email). Il se spécialise en `Commercant` et/ou `Client` via une relation 1-1 optionnelle, et porte un flag `estAdmin`. Un même compte peut être commerçant *et* client : `exigerClient()` crée le profil client à la volée si un commerçant passe commande.

Points à connaître :

- **Montants** : `Decimal(12,2)` en base, affichés en MRU via `formatMRU`. Attention aux conversions `Decimal` → `number` à la frontière serveur/client.
- **`LigneCommande` dénormalise** `nomProduit` et `prixUnitaire` : une commande passée conserve son prix même si le produit change ensuite. La relation vers `Produit` est en `onDelete: Restrict` (les autres sont en `Cascade`).
- **`Boutique.slug`** est unique et sert d'URL publique ; il est généré par [`lib/utils/slug.ts`](lib/utils/slug.ts).
- **Enums de statut** : `StatutCredit` (NON_PAYE / EN_COURS / PAYE), `StatutCommande` (8 états, de NOUVELLE à LIVREE / REFUSEE / ANNULEE), `ModeCommande` (LIVRAISON / RETRAIT), `StatutPaiementAbonnement` (EN_ATTENTE / APPROUVE / REJETE).

---

## Authentification et accès

**Session** ([`lib/auth/session.ts`](lib/auth/session.ts)) : JWT HS256 signé avec `SESSION_SECRET`, stocké dans le cookie `shopbook_session` (httpOnly, sameSite lax, 7 jours). Le payload ne contient que l'`utilisateurId`.

**Gardes** ([`lib/auth/auth.ts`](lib/auth/auth.ts)) — à appeler en tête de chaque page ou action protégée :

| Fonction | Comportement |
|---|---|
| `getUtilisateurActuel()` | Lecture souple, renvoie `null` si non connecté (pages publiques) |
| `exigerUtilisateur()` | Redirige vers `/login` sinon |
| `exigerCommercant()` | Renvoie le `commercantId`, redirige sinon |
| `exigerClient()` | Renvoie le `clientId`, **le crée s'il n'existe pas** |
| `exigerAdmin()` | Redirige si `estAdmin` est faux |

## Abonnement

Réglages dans [`lib/config.ts`](lib/config.ts) : **7 jours** d'essai gratuit, puis **500 MRU / 30 jours**.

Le parcours : le commerçant paie par mobile money hors application, téléverse la capture d'écran du reçu (bucket privé `preuves-paiement`), et l'admin la consulte via une URL signée valable 1 h avant d'approuver ou de rejeter avec un motif.

[`exigerAcces()`](lib/auth/abonnement.ts) est appelée dans [`app/(dashboard)/layout.tsx`](app/(dashboard)/layout.tsx) : elle couvre donc tout l'espace commerçant d'un coup et redirige vers `/abonnement` si l'essai est terminé sans abonnement actif. La vitrine et les commandes clients restent accessibles.

## Fichiers et images

[`lib/services/storage.ts`](lib/services/storage.ts) gère deux buckets Supabase aux règles différentes :

- **`produits`** — public. `uploadImageProduit()` renvoie l'URL publique directe, stockée dans `ImageProduit.url`. `supprimerImageBucket()` est appelée à la suppression d'une image pour ne pas laisser de fichiers orphelins.
- **`preuves-paiement`** — privé. `uploadCapture()` renvoie un **chemin interne**, pas une URL ; `getCaptureUrl()` produit un lien signé temporaire à la demande.

Les images sont compressées côté navigateur (`browser-image-compression`) avant envoi.

---

## Points d'attention

- **`lib/services/sms.ts` ne fait qu'un `console.log`.** Les codes de réinitialisation de mot de passe s'affichent dans le terminal du serveur. À brancher sur un vrai fournisseur (Twilio ou autre) avant toute mise en production.
- **`hooks/use-madia-query.tsx`** — la faute de frappe est dans le nom du fichier ; le renommer impose de corriger tous les imports.
- **Le client Prisma généré est commité** dans `app/generated/prisma/`. Ses changements apparaissent dans les diffs à chaque `prisma generate`.
- Le pays par défaut est `"Mauritanie"` et la devise le MRU, en dur dans le schéma et les helpers.
