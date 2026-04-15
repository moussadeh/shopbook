import { PrismaClient, StatutCredit, UniteProduit } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});
console.log("Connected to database");
async function main() {
    const hashedPassword = await bcrypt.hash("password", 10);

    // Commerçants
    const commercant1 = await prisma.commercant.create({
        data: {
            nom: "Ahmed",
            prenom: "Ould Mohamed",
            telephone: "+22236123456",
            email: "ahmed.baraka@example.com",
            motDePasse: hashedPassword,
            nomBoutique: "Boutique Baraka",
            description: "Épicerie de quartier vendant des produits de première nécessité.",
            ville: "Nouakchott",
            quartier: "Tevragh-Zeina",
            pays: "Mauritanie",
            isAbonne: true,
        },
    });
    const commercant2 = await prisma.commercant.create({
        data: {
            nom: "Mohamed",
            prenom: "Ould Sidi",
            telephone: "+22236222333",
            email: "mohamed.quincaillerie@example.com",
            motDePasse: hashedPassword,
            nomBoutique: "Quincaillerie Sahel",
            description: "Vente de matériaux et équipements pour la maison.",
            ville: "Nouakchott",
            quartier: "Basra",
            pays: "Mauritanie",
            isAbonne: true,
        },
    });

    // Produits
    const produitsC1 = await prisma.produit.createMany({
        data: [
            { commercantId: commercant1.id, nom: "Riz", prixUnitaire: 20, unite: UniteProduit.KILO },
            { commercantId: commercant1.id, nom: "Sucre", prixUnitaire: 20, unite: UniteProduit.KILO },
            { commercantId: commercant1.id, nom: "Huile", prixUnitaire: 20, unite: UniteProduit.LITRE },
            { commercantId: commercant1.id, nom: "Lait en poudre", prixUnitaire: 10, unite: UniteProduit.SACHET },
            { commercantId: commercant1.id, nom: "Thé vert", prixUnitaire: 20, unite: UniteProduit.PAQUET },
        ],
    });
    await prisma.produit.createMany({
        data: [
            { commercantId: commercant2.id, nom: "Ciment", prixUnitaire: 100, unite: UniteProduit.SAC },
            { commercantId: commercant2.id, nom: "Peinture", prixUnitaire: 200, unite: UniteProduit.BIDON },
            { commercantId: commercant2.id, nom: "Clous", prixUnitaire: 50, unite: UniteProduit.KILO },
        ],
    });

    // Récupération des produits pour les relations
    const riz = await prisma.produit.findFirst({ where: { nom: "Riz", commercantId: commercant1.id } });
    const sucre = await prisma.produit.findFirst({ where: { nom: "Sucre", commercantId: commercant1.id } });
    const huile = await prisma.produit.findFirst({ where: { nom: "Huile", commercantId: commercant1.id } });
    const ciment = await prisma.produit.findFirst({ where: { nom: "Ciment", commercantId: commercant2.id } });

    // Clients
    const client1 = await prisma.client.create({
        data: {
            nom: "Sidi",
            prenom: "Mohamed",
            telephone: "+22244111222",
            email: "sidi@example.com",
        },
    });
    const client2 = await prisma.client.create({
        data: {
            nom: "Aïcha",
            prenom: "Mint Ahmed",
            telephone: "+22244111333",
        },
    });
    const client3 = await prisma.client.create({
        data: {
            nom: "Oumar",
            prenom: "Diallo",
            telephone: "+22244111444",
        },
    });

    // Crédits
    await prisma.credit.create({
        data: {
            commercantId: commercant1.id,
            clientId: client1.id,
            montantTotal: 400,
            montantPaye: 200,
            statutCredit: StatutCredit.PARTIELLEMENT_PAYE,
            description: "Achat de riz et sucre",
            produits: {
                create: [
                    {
                        produitId: riz!.id,
                        quantite: 10,
                        prixUnitaire: 20,
                        montantTotal: 200,
                    },
                    {
                        produitId: sucre!.id,
                        quantite: 10,
                        prixUnitaire: 20,
                        montantTotal: 200,
                    },
                ],
            },
            paiements: {
                create: [{ montant: 100 }, { montant: 100 }],
            },
        },
    });
    await prisma.credit.create({
        data: {
            commercantId: commercant1.id,
            clientId: client2.id,
            montantTotal: 200,
            statutCredit: StatutCredit.NON_PAYE,
            description: "Achat d'huile",
            produits: {
                create: [
                    {
                        produitId: huile!.id,
                        quantite: 10,
                        prixUnitaire: 20,
                        montantTotal: 200,
                    },
                ],
            },
        },
    });
    await prisma.credit.create({
        data: {
            commercantId: commercant2.id,
            clientId: client3.id,
            montantTotal: 200,
            montantPaye: 200,
            statutCredit: StatutCredit.PAYE,
            description: "Achat de sacs de ciment",
            produits: {
                create: [
                    {
                        produitId: ciment!.id,
                        quantite: 2,
                        prixUnitaire: 100,
                        montantTotal: 200,
                    },
                ],
            },
            paiements: {
                create: [{ montant: 200 }],
            },
        },
    });

    console.log("Insertion terminée.");
}
console.log("Starting seeding...");
main()
    .catch((e) => {
        console.error("Erreur lors de l'insertion :", e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("fin");
        await prisma.$disconnect();
    })
;
console.log("Seeding completed.");