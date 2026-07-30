const GAME_DATA = {
    // Profil de base du joueur à l'initialisation
    joueurTemplate: {
        nom: "Sung",
        metierCivil: "Chomeur",
        classe: "Inconnue",
        niveau: 1,
        or: 200,
        timers: {
            joursRestantsLoyer: 7,
            joursRestantsHopital: 28
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
        inventaire: ["item_bandage_01", "item_potion_mineure"]
    },

    // Catalogue des objets et consommables
    objets: {
        "item_vetement_sport": {
            nom: "Vêtements de Sport Renforcés",
            type: "armure",
            rarete: "gris",
            prix: 200,
            bonusStats: { vitalite: 1, agilite: 1 }
        },
        "item_bandage_01": {
            nom: "Bandage de Fortune",
            type: "consommable",
            rarete: "gris",
            prix: 50,
            effet: { soinPv: 15 }
        },
        "item_potion_mineure": {
            nom: "Potion de Soin Mineure",
            type: "consommable",
            rarete: "vert",
            prix: 250,
            effet: { soinPvPourcentage: 30 }
        },
        "item_dague_emoussee": {
            nom: "Dague Émoussée",
            type: "arme",
            rarete: "gris",
            prix: 300,
            bonusStats: { agilite: 2 }
        }
    },

    // Bestiaire de base
    monstres: {
        "mob_gobelin": {
            nom: "Gobelin Éclaireur",
            rang: "E",
            stats: { pv: 30, force: 6, agilite: 8 },
            recompenses: { xp: 15, orMin: 20, orMax: 50 }
        },
        "mob_loup_feroce": {
            nom: "Loup Féroce",
            rang: "E",
            stats: { pv: 45, force: 8, agilite: 12 },
            recompenses: { xp: 25, orMin: 35, orMax: 80 }
        }
    },

    // Événements narratifs de la Phase 1
    evenementsCivils: [
        {
            id: "evt_metro_01",
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac. Il se dirige vers vous.",
            choix: [
                {
                    texte: "Plaquer le voleur au sol au moment où il passe.",
                    gainStat: "reflexe",
                    valeurGain: 1,
                    affiniteClasse: "Assassin"
                },
                {
                    texte: "Suivre le voleur de loin sans vous faire repérer.",
                    gainStat: "perception",
                    valeurGain: 1,
                    affiniteClasse: "Ranger"
                },
                {
                    texte: "Crier pour alerter la foule et couper sa trajectoire.",
                    gainStat: "intelligence",
                    valeurGain: 1,
                    affiniteClasse: "Mage"
                }
            ]
        },
        {
            id: "evt_chantier_01",
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer lors d'une mission de portage en ville.",
            choix: [
                {
                    texte: "Foncer et repousser le bloc à mains nues en forçant.",
                    gainStat: "force",
                    valeurGain: 1,
                    affiniteClasse: "Berserker"
                },
                {
                    texte: "Esquiver de justesse en faisant preuve d'une agilité hors norme.",
                    gainStat: "agilite",
                    valeurGain: 1,
                    affiniteClasse: "Assassin"
                },
                {
                    texte: "Encaisser le choc pour protéger un autre travailleur.",
                    gainStat: "vitalite",
                    valeurGain: 1,
                    affiniteClasse: "Tank"
                }
            ]
        }
    ]
};
