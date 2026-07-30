const GAME_DATA = {
    joueurTemplate: {
        nom: "Sung",
        metierCivil: "Ouvrier / Chômeur",
        rangLicence: "E",
        reputation: 10,
        niveau: 1,
        or: 300,
        timers: {
            loyerJours: 7
        },
        statsActuelles: {
            pvActuels: 100,
            pmActuels: 50,
            fatigue: 0
        },
        statsMax: {
            pvMax: 100,
            pmMax: 50,
            force: 5,
            agilite: 5,
            vitalite: 5,
            intelligence: 5,
            perception: 7,
            reflexe: 6
        },
        equipement: {
            tete: null,
            torse: "item_vetement_sport",
            mains: null,
            accessoire: null
        },
        inventaire: ["item_bandage_01", "item_potion_mineure", "item_dague_emoussee"]
    },

    objets: {
        "item_vetement_sport": {
            id: "item_vetement_sport",
            nom: "Vêtements de Sport Renforcés",
            type: "armure",
            slot: "torse",
            rarete: "gris",
            prix: 200,
            bonusStats: { vitalite: 1, agilite: 1 }
        },
        "item_bandage_01": {
            id: "item_bandage_01",
            nom: "Bandage de Fortune",
            type: "consommable",
            rarete: "gris",
            prix: 50,
            effet: { soinPv: 25 }
        },
        "item_potion_mineure": {
            id: "item_potion_mineure",
            nom: "Potion de Soin Mineure",
            type: "consommable",
            rarete: "vert",
            prix: 250,
            effet: { soinPvPourcentage: 30 }
        },
        "item_dague_emoussee": {
            id: "item_dague_emoussee",
            nom: "Dague Émoussée",
            type: "arme",
            slot: "mains",
            rarete: "gris",
            prix: 300,
            bonusStats: { agilite: 2 }
        },
        "item_epee_fer": {
            id: "item_epee_fer",
            nom: "Épée Longue en Fer",
            type: "arme",
            slot: "mains",
            rarete: "gris",
            prix: 350,
            bonusStats: { force: 2 }
        }
    },

    boutiques: [
        {
            id: "shop_civil",
            nom: "Épicerie de Quartier",
            requis: { type: "aucun" },
            articles: ["item_bandage_01", "item_vetement_sport"]
        },
        {
            id: "shop_assoc_e",
            nom: "Boutique Association - Rang E",
            requis: { type: "rang", valeur: "E", message: "Requiert une licence de Chasseur" },
            articles: ["item_potion_mineure", "item_dague_emoussee"]
        },
        {
            id: "shop_assoc_d",
            nom: "Boutique Association - Rang D",
            requis: { type: "rang", valeur: "D", message: "Rang de Chasseur insuffisant (Requis: Rang D)" },
            articles: ["item_epee_fer"]
        },
        {
            id: "shop_noir",
            nom: "Marché Noir Clandestin",
            requis: { type: "reputation", valeur: 25, message: "Réputation insuffisante (Requis: 25)" },
            articles: ["item_potion_mineure", "item_epee_fer"]
        }
    ],

    monstres: {
        "mob_gobelin": {
            nom: "Gobelin Éclaireur",
            rang: "E",
            stats: { pv: 30, pvMax: 30, force: 6, agilite: 8 },
            recompenses: { xp: 20, orMin: 30, orMax: 60 },
            description: "Un petit humanoïde à la peau verte, armé d'un couteau rouillé, ricanant nerveusement."
        },
        "mob_loup_feroce": {
            nom: "Loup Féroce des Cavernes",
            rang: "E",
            stats: { pv: 45, pvMax: 45, force: 8, agilite: 12 },
            recompenses: { xp: 35, orMin: 50, orMax: 100 },
            description: "Une bête sauvage aux yeux luisants et aux crocs acérés bavant de salive toxique."
        },
        "mob_orc": {
            nom: "Haut-Orc des Cavernes",
            rang: "D",
            stats: { pv: 90, pvMax: 90, force: 15, agilite: 10 },
            recompenses: { xp: 80, orMin: 150, orMax: 300 },
            description: "Un colosse musclé brandissant une lourde massue en pierre cloutée."
        }
    },

    evenementsCivils: [
        {
            id: "evt_metro_01",
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac vers vous.",
            choix: [
                { texte: "Plaquer le voleur au sol.", gainStat: "reflexe", valeur: 1, resultat: "Vous anticipez sa trajectoire et le plaquez net au sol. La foule applaudit.", affinite: "Assassin" },
                { texte: "Suivre discrètement sa fuite.", gainStat: "perception", valeur: 1, resultat: "Vous repérez ses points de chute dans la station sans vous faire repérer.", affinite: "Ranger" },
                { texte: "Crier pour alerter la foule.", gainStat: "intelligence", valeur: 1, resultat: "Votre intervention vocale mobilise les agents de sécurité à temps.", affinite: "Mage" }
            ]
        },
        {
            id: "evt_chantier_01",
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer lors de votre service de portage.",
            choix: [
                { texte: "Retenir le bloc à mains nues.", gainStat: "force", valeur: 1, resultat: "Vos muscles se contractent violemment, retenant la masse de béton in extremis.", affinite: "Berserker" },
                { texte: "Esquiver l'impact de justesse.", gainStat: "agilite", valeur: 1, resultat: "Vous glissez hors de la zone d'impact une fraction de seconde avant le crash.", affinite: "Assassin" },
                { texte: "Encaisser pour protéger un collègue.", gainStat: "vitalite", valeur: 1, resultat: "Le choc vous brise le souffle mais votre collègue est sain et sauf.", affinite: "Tank" }
            ]
        },
        {
            id: "evt_ruelle_01",
            titre: "Agression Nocturne",
            texte: "En rentrant tard par une ruelle sombre, vous entendez des bruits de lutte étouffés.",
            choix: [
                { texte: "Intervenir directement pour aider.", gainStat: "force", valeur: 1, resultat: "Vous foncez dans le tas et mettez les agresseurs en fuite par pure force brute.", affinite: "Berserker" },
                { texte: "Analyser l'angle d'attaque dans l'ombre.", gainStat: "perception", valeur: 1, resultat: "Vous évaluez parfaitement la disposition des lieux et des issues de secours.", affinite: "Ranger" },
                { texte: "Faire diversion en jetant des débris.", gainStat: "intelligence", valeur: 1, resultat: "Votre diversion sème la confusion totale parmi les agresseurs.", affinite: "Mage" }
            ]
        },
        {
            id: "evt_bureau_01",
            titre: "Heures Supplémentaires Épuisantes",
            texte: "Votre patron exige un inventaire complet et minutieux sous peine de retenue sur salaire.",
            choix: [
                { texte: "Tenir tête et finir par l'endurance physique.", gainStat: "vitalite", valeur: 1, resultat: "Vous tenez toute la nuit debout malgré la fatigue accumulée.", affinite: "Tank" },
                { texte: "Optimiser la méthode de classement par réflexe.", gainStat: "reflexe", valeur: 1, resultat: "Vos mains parcourent les dossiers à une vitesse fulgurante.", affinite: "Assassin" },
                { texte: "Concevoir un script mental d'organisation.", gainStat: "intelligence", valeur: 1, resultat: "Votre esprit logique vient à bout des erreurs en un temps record.", affinite: "Mage" }
            ]
        },
        {
            id: "evt_magasin_01",
            titre: "Colis Lourd à Livrer",
            texte: "Un client pressé demande le transport express d'une caisse suspecte et lourde.",
            choix: [
                { texte: "Porter la caisse sans broncher.", gainStat: "force", valeur: 1, resultat: "Vous soulevez la lourde caisse sous le regard ébahi du client.", affinite: "Berserker" },
                { texte: "Gérer l'équilibre en courant agilement.", gainStat: "agilite", valeur: 1, resultat: "Vous slalomez entre les piétons avec une aisance déconcertante.", affinite: "Ranger" },
                { texte: "Anticiper les embouteillages du quartier.", gainStat: "perception", valeur: 1, resultat: "Vous choisissez le raccourci parfait pour arriver en avance.", affinite: "Ranger" }
            ]
        }
    ],

    donjons: [
        { id: "dungeon_e", nom: "Portail de Rang E (Carrière Abandonnée)", rang: "E", monstreId: "mob_gobelin" },
        { id: "dungeon_d", nom: "Portail de Rang D (Caverne des Loups)", rang: "D", monstreId: "mob_orc" }
    ]
};
