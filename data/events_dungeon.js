const DUNGEON_EVENTS = {
    'E': {
        monsters: [
            {
                name: "Gobelin Éclaireur",
                text: "Un gobelin chétif mais armé d'une dague rouillée vous saute dessus.",
                choices: [
                    { text: "Parer et contre-attaquer (Force requise)", statCheck: "strength", diff: 12, 
                      win: { text: "Vous bloquez le coup et l'abattez d'un coup sec.", effect: { fatigue: 5 } }, 
                      lose: { text: "Il est plus rapide que prévu. Sa dague vous entaille le bras.", effect: { hp: -15, fatigue: 10 } } },
                    { text: "Esquiver (Agilité requise)", statCheck: "agility", diff: 12, 
                      win: { text: "Vous esquivez avec grâce et le frappez dans le dos.", effect: { fatigue: 2 } }, 
                      lose: { text: "Vous trébuchez. Il en profite pour vous frapper.", effect: { hp: -10, fatigue: 15 } } }
                ]
            },
            {
                name: "Loup Lycanthrope",
                text: "Un loup massif aux yeux rouges vous barre la route en grognant.",
                choices: [
                    { text: "Attaque brutale (Force requise)", statCheck: "strength", diff: 15, 
                      win: { text: "Votre coup brise ses os. Le loup s'effondre.", effect: { fatigue: 8 } }, 
                      lose: { text: "Votre attaque rebondit sur son cuir. Il vous mord violemment !", effect: { hp: -25, fatigue: 10 } } }
                ]
            }
        ],
        traps: [
            {
                text: "Vous marchez sur une dalle suspecte. Des fléchettes sortent des murs !",
                choices: [
                    { text: "Plonger au sol (Agilité requise)", statCheck: "agility", diff: 14, 
                      win: { text: "Vous passez juste en dessous. Indemne.", effect: {} }, 
                      lose: { text: "Une fléchette vous érafle. Un poison léger engourdit vos muscles.", effect: { hp: -10, vitality: -1 } } }
                ]
            }
        ],
        boss: {
            name: "Chef Gobelin",
            text: "Le chef de la meute, deux fois plus grand que les autres, manie une hache lourde.",
            choices: [
                { text: "Viser la tête (Agilité + Force)", statCheck: "hybrid", diff: 25, 
                  win: { text: "Un coup parfait ! La hache tombe, le boss avec. Le portail commence à se dissiper.", effect: { fatigue: 20 } }, 
                  lose: { text: "Il bloque votre attaque et vous repousse violemment contre un mur.", effect: { hp: -40, fatigue: 20 } } }
            ],
            loot: { money: 15000, exp: 50, item: "Noyau Magique E" }
        }
    }
    // D'autres rangs (D, C, etc.) pourront être ajoutés ici sur le même modèle.
};
