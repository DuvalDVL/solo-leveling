const DUNGEON_EVENTS = {
    'E': {
        monsters: [
            {
                name: "Gobelin Éclaireur",
                text: "Un gobelin chétif mais armé d'une dague rouillée vous saute dessus.",
                choices: [
                    { text: "Parer et contre-attaquer (Force)", statCheck: "strength", diff: 12, win: { text: "Vous l'abattez d'un coup sec.", effect: { fatigue: 5 } }, lose: { text: "Sa dague vous entaille le bras.", effect: { hp: -15, fatigue: 10 } } },
                    { text: "Esquiver (Agilité)", statCheck: "agility", diff: 12, win: { text: "Vous le frappez dans le dos.", effect: { fatigue: 2 } }, lose: { text: "Vous trébuchez.", effect: { hp: -10, fatigue: 15 } } }
                ]
            }
        ],
        traps: [
            {
                text: "Des fléchettes sortent des murs !",
                choices: [
                    { text: "Plonger au sol (Agilité)", statCheck: "agility", diff: 14, win: { text: "Indemne.", effect: {} }, lose: { text: "Poison léger.", effect: { hp: -10, vitality: -1 } } }
                ]
            }
        ],
        boss: {
            name: "Chef Gobelin",
            text: "Le chef de la meute manie une hache lourde.",
            choices: [
                { text: "Viser la tête (Agilité + Force)", statCheck: "hybrid", diff: 25, win: { text: "La hache tombe, le boss avec.", effect: { fatigue: 20 } }, lose: { text: "Il vous repousse violemment.", effect: { hp: -40, fatigue: 20 } } },
                // CHOIX CONTEXTUEL (Débloqué par le trait)
                { text: "[Fléau des Gobelins] Exploiter sa faille respiratoire", requiredTrait: "tueur_gobelin", statCheck: "agility", diff: 10, win: { text: "Vous connaissez cette race par cœur. Un coup précis à la gorge le tue instantanément.", effect: {} }, lose: { text: "Raté de peu !", effect: { hp: -20 } } }
            ],
            loot: { money: 15000, exp: 50, item: "Noyau Magique E" }
        }
    }
};
