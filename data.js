const GAME_DATA = {
    joueurTemplate: {
        nom: "Sung",
        metierCivil: "Chomeur",
        classe: "Inconnue",
        niveau: 1,
        or: 300,
        timers: {
            loyerJours: 7,
            hopitalJours: 28
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

    monstres: {
        "mob_gobelin": {
            nom: "Gobelin Éclaireur",
            rang: "E",
            stats: { pv: 30, pvMax: 30, force: 6, agilite: 8 },
            recompenses: { xp: 20, orMin: 30, orMax: 60 }
        },
        "mob_loup_feroce": {
            nom: "Loup Féroce",
            rang: "E",
            stats: { pv: 45, pvMax: 45, force: 8, agilite: 12 },
            recompenses: { xp: 35, orMin: 50, orMax: 100 }
        },
        "mob_orc": {
            nom: "Haut-Orc des Cavernes",
            rang: "D",
            stats: { pv: 90, pvMax: 90, force: 15, agilite: 10 },
            recompenses: { xp: 80, orMin: 150, orMax: 300 }
        }
    },

    evenementsCivils: [
        {
            id: "evt_metro_01",
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac vers vous.",
            choix: [
                { texte: "Plaquer le voleur au sol.", gainStat: "reflexe", valeur: 1, affinite: "Assassin" },
                { texte: "Suivre discrètement sa fuite.", gainStat: "perception", valeur: 1, affinite: "Ranger" },
                { texte: "Crier pour alerter la foule.", gainStat: "intelligence", valeur: 1, affinite: "Mage" }
            ]
        },
        {
            id: "evt_chantier_01",
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer lors de votre service de portage.",
            choix: [
                { texte: "Retenir le bloc à mains nues.", gainStat: "force", valeur: 1, affinite: "Berserker" },
                { texte: "Esquiver l'impact de justesse.", gainStat: "agilite", valeur: 1, affinite: "Assassin" },
                { texte: "Encaisser pour protéger un collègue.", gainStat: "vitalite", valeur: 1, affinite: "Tank" }
            ]
        }
    ],

    donjons: [
        { id: "dungeon_e", nom: "Portail de Rang E (Carrière Abandonnée)", rang: "E", monstreId: "mob_gobelin" },
        { id: "dungeon_d", nom: "Portail de Rang D (Caverne des Loups)", rang: "D", monstreId: "mob_orc" }
    ]
};
