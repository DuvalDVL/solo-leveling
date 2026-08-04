// ==========================================
// DATA-GUILDES.JS
// Guildes recrutables, guildes canoniques (cibles de recrutement ou de braquage), et paliers du QG de guilde du joueur
// ==========================================

const guildesData = [

    // ==========================================
    // GUILDES MINEURES (debut de jeu, rangs E a C)
    // ==========================================
    {
        id: "chiens_garde",
        nom: "Les Chiens de Garde",
        categorie: "mineure",
        rangRequis: "E",
        salaireBase: 100,
        commission: 0.4,
        bonus: { defense: 0, attaque: 5 },
        description: "Guilde precaire, idealement pour les debutants desesperes. Contrats faciles mais grosse commission sur le butin."
    },
    {
        id: "bouclier_argent",
        nom: "Le Bouclier d'Argent",
        categorie: "mineure",
        rangRequis: "D",
        salaireBase: 300,
        commission: 0.2,
        bonus: { defense: 20, pvMax: 50 },
        description: "Guilde defensive au salaire fixe, couvre une partie des frais medicaux de ses allies."
    },
    {
        id: "charognards",
        nom: "Les Charognards",
        categorie: "mineure",
        rangRequis: "E",
        salaireBase: 80,
        commission: 0.1,
        bonus: { or_vente_cadavres: 1.5 },
        description: "Ne combattent pas. Payent tres cher pour les Cadavres de Monstre rapportes des donjons. Ideal pour financer les debuts."
    },

    // ==========================================
    // GUILDES CANONIQUES (milieu/fin de jeu, rangs B a S)
    // Accessibles en recrutement a partir du Rang C, ou ciblees en braquage si voie du Renegat
    // ==========================================
    {
        id: "guilde_hunters",
        nom: "La Guilde des Chasseurs (Hunters)",
        categorie: "canonique",
        rangRequis: "A",
        salaireBase: 3000,
        commission: 0.1,
        bonus: { toutesStats: 10, reputation: 1.2 },
        description: "L'elite absolue. Demande des statistiques colossales pour y entrer. Offre les meilleurs equipements du hub humain.",
        exigence: { niveauMin: 30, reputationMin: 500 }
    },
    {
        id: "tigre_blanc",
        nom: "La Guilde du Tigre Blanc (Baekho)",
        categorie: "canonique",
        rangRequis: "A",
        salaireBase: 2500,
        commission: 0.1,
        bonus: { force: 50, critique: 0.2 },
        description: "Prestigieuse et brutale. Seuls les plus forts survivent a leurs raids. Bonus de degats corps a corps pour les allies recrutes.",
        exigence: { niveauMin: 25, reputationMin: 350 }
    },
    {
        id: "faucheurs",
        nom: "La Guilde des Faucheurs (Reapers)",
        categorie: "canonique",
        rangRequis: "B",
        salaireBase: 4000,
        commission: 0.05,
        bonus: { or_contrats: 1.5 },
        description: "Salaire enorme, mais la fuite d'un donjon est interdite par contrat. Trahir cette guilde fait chuter le Karma tres fortement.",
        exigence: { niveauMin: 20, reputationMin: 250 },
        clauseSpeciale: { type: "fuite_interdite", penaliteKarma: -20 }
    },
    {
        id: "renommee",
        nom: "La Guilde de la Renommee (Fame)",
        categorie: "canonique",
        rangRequis: "B",
        salaireBase: 2200,
        commission: 0.15,
        bonus: { intelligence: 30, pmMax: 100 },
        description: "Ideale pour les joueurs axes sur l'Intelligence, Mages et Soigneurs.",
        exigence: { niveauMin: 18, reputationMin: 200 }
    },
    {
        id: "chevaliers",
        nom: "La Guilde des Chevaliers (Knights)",
        categorie: "canonique",
        rangRequis: "B",
        salaireBase: 1800,
        commission: 0.15,
        bonus: { defense: 40, vitalite: 20 },
        description: "Guilde traditionaliste. Exige un Karma strictement positif pour y rester, exclusion immediate si le Karma passe negatif.",
        exigence: { niveauMin: 18, reputationMin: 200, karmaMin: 10 }
    }

];

// ==========================================
// PALIERS DU QG DE GUILDE DU JOUEUR (money sink end-game)
// Debloque une fois le Permis de Guilde achete (Rang B minimum requis)
// ==========================================

const qgGuildeJoueurData = {
    permis: {
        id: "permis_guilde",
        nom: "Permis de Guilde",
        cout: 100000,
        rangRequis: "B",
        description: "Officialise la creation de votre propre guilde aupres de l'Association."
    },
    paliers: [
        {
            niveau: 1,
            nom: "Sous-sol Miteux",
            cout: 0,
            limiteEscouades: 1,
            escouadesRangMax: "D",
            bonus: {},
            description: "Un local exigu, a peine assez grand pour entreposer du materiel. Attrait tres faible."
        },
        {
            niveau: 2,
            nom: "Bureaux Standards",
            cout: 250000,
            limiteEscouades: 3,
            escouadesRangMax: "C",
            bonus: { salleRepos: true, reductionFatigueAllies: 0.2 },
            description: "Debloque une salle de repos qui reduit la fatigue accumulee par vos troupes."
        },
        {
            niveau: 3,
            nom: "Immeuble de Guilde",
            cout: 800000,
            limiteEscouades: 5,
            escouadesRangMax: "B",
            bonus: { centreEntrainement: true, xpPassifAllies: 0.1 },
            description: "Debloque un centre d'entrainement, vos troupes gagnent de l'XP passivement."
        },
        {
            niveau: 4,
            nom: "Gratte-ciel de Maitre",
            cout: 3000000,
            limiteEscouades: null,
            escouadesRangMax: "S",
            bonus: { escouadesIllimitees: true, attireChasseursEliteRangAS: true },
            description: "Escouades illimitees. Attire naturellement des chasseurs de Rang A et S."
        }
    ]
};
